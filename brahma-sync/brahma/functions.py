"""Library of helper function using ACI Cobra SDK"""
import cobra.model.fabric as aciFabric
import cobra.mit.session as aciSession
import cobra.mit.request as aciRequest
import cobra.mit.access as aciAccess
import cobra.model.fv as aciFv
import cobra.model.mgmt as aciMgmt
import cobra.model.pol as aciPol
import cobra.model.bgp as aciBgp
import cobra.model.datetime as aciDateTime
import cobra.model.ospf as aciOspf
import cobra.model.l3ext as aciL3Ext
import cobra.model.file as aciFile
import cobra.model.trig as aciTrig
import cobra.model.config as aciConfig
import cobra.model.fvns as aciFvns
import cobra.model.infra as aciInfra
import cobra.model.pki as aciPki
from cobra.model import lldp
from cobra.model import cdp
from cobra.model import lacp
from cobra.model import phys
from cobra.model import vmm
import requests
import re
import json
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)


def getMoDirectoryFromApic(apic):
    "Login to APIC, get a Mo Directory then login and return the mo object."
    ls = aciSession.LoginSession(apic['url'], apic['user'], apic['password'])
    md = aciAccess.MoDirectory(ls)
    md.login()
    return md


def pushMoToApic(mo, moDirectory):
    "Push a given Mo to the APIC to commit changes"
    configRequest = aciRequest.ConfigRequest()
    configRequest.addMo(mo)
    moDirectory.commit(configRequest)


def createFabricNodes(moDirectory, fabricNodes):
    "Add fabric nodes to an ACI controller Mo"
    controllerMo = moDirectory.lookupByDn('uni/controller')
    fabricNodeIdentPol = aciFabric.NodeIdentPol(controllerMo)
    for podId, nodes in fabricNodes['pods'].iteritems():
        for node in nodes:
            aciFabric.NodeIdentP(
                fabricNodeIdentPol, serial=node['serial'], podId=podId,
                name=node['name'], nodeId=node['nodeId'])
    return controllerMo


def removeFabricNodes(moDirectory, selector='all'):
    "Decommission fabric nodes"
    fabricMo = moDirectory.lookupByDn('uni/fabric')
    servicePol = aciFabric.OOServicePol(fabricMo)
    if selector == 'all':
        nodes = moDirectory.lookupByClass("fabricNode", parentDn='topology')
        for node in nodes:
            if node.role == 'controller' or node.fabricSt != 'active':
                continue
            aciFabric.RsDecommissionNode(servicePol,
                                         removeFromController='true',
                                         tDn=node.dn)

    return fabricMo


def configOobMgmt(config):
    "Configure the Out of Band management addresses for given fabric nodes"
    fvTenant = aciFv.Tenant(aciPol.Uni(''), name='mgmt')
    mgmtMgmtP = aciMgmt.MgmtP(fvTenant, name='default')
    mgmtOoB = aciMgmt.OoB(mgmtMgmtP, prio='unspecified', name='default')
    for podId, nodes in config.fabricNodes['pods'].iteritems():
        for node in nodes:
            aciMgmt.RsOoBStNode(mgmtOoB,
                                gw=config.mgmtOob['gw'],
                                v6Gw=config.mgmtOob['v6Gw'],
                                v6Addr=node['v6Addr'], addr=node['addr'],
                                tDn=getDnFromPodIdNodeId(podId,
                                                         node['nodeId']))

    return fvTenant


def createPodPolicy(config):
    fabricInst = aciFabric.Inst(aciPol.Uni(''))
    aciDateTime.Format(fabricInst, name='default', tz=config.timezone)
    datetimePol = aciDateTime.Pol(fabricInst, name='default')
    for ntp in config.ntpList:
        datetimeNtpProv = aciDateTime.NtpProv(datetimePol,
                                              preferred=ntp['preferred'],
                                              name=ntp['name'],
                                              descr=ntp['descr'])
        aciDateTime.RsNtpProvToEpg(datetimeNtpProv,
                                   tDn='uni/tn-mgmt/mgmtp-default/oob-default')
    bgpInstPol = aciBgp.InstPol(fabricInst, name='default')
    aciBgp.AsP(bgpInstPol, name='aspn', asn=config.bgpAsn)
    bgpRRP = aciBgp.RRP(bgpInstPol, name='route-reflector')
    for rrNodeId in getRrNodeIdList(config.fabricNodes):
        aciBgp.RRNodePEp(bgpRRP, id=rrNodeId)

    fabricFuncP = aciFabric.FuncP(fabricInst)
    fabricPodPGrp = aciFabric.PodPGrp(fabricFuncP,
                                      name='default-PodPolicyGroup')
    aciFabric.RsPodPGrpBGPRRP(fabricPodPGrp, tnBgpInstPolName='default')
    aciFabric.RsTimePol(fabricPodPGrp, tnDatetimePolName='default')
    aciFabric.RsPodPGrpIsisDomP(fabricPodPGrp, tnIsisDomPolName='default')
    aciFabric.RsPodPGrpCoopP(fabricPodPGrp, tnCoopPolName='default')
    aciFabric.RsCommPol(fabricPodPGrp, tnCommPolName='default')
    aciFabric.RsSnmpPol(fabricPodPGrp, tnSnmpPolName='default')
    fabricPodP = aciFabric.PodP(fabricInst, name='default')
    fabricPodS = aciFabric.PodS(fabricPodP, type='ALL', name='default')
    aciFabric.RsPodPGrp(fabricPodS, tDn=fabricPodPGrp.dn)
    return fabricInst


def getRrNodeIdList(fabricNodes):
    "Create list of RR nodeId based on fabricNodes config"
    rrNodeList = []
    for podId, nodes in fabricNodes['pods'].iteritems():
        for node in nodes:
            if node['rr']:
                rrNodeList.append(node['nodeId'])
    return rrNodeList


def createIpnOspfIfPolicy(name):
    "Create OSPF Policy for MPod"
    fvTenant = aciFv.Tenant(aciPol.Uni(''), 'infra')
    aciOspf.IfPol(fvTenant, pfxSuppress='inherit', nwT='p2p', name=name,
                  prio='1', ctrl='advert-subnet', helloIntvl='10',
                  rexmitIntvl='5', xmitDelay='1', cost='unspecified',
                  deadIntvl='40')
    return fvTenant


def createTEPPools(moDirectory, podTepPools):
    controllerMo = moDirectory.lookupByDn('uni/controller')
    fabricSetupPol = aciFabric.SetupPol(controllerMo)
    for podId, tepPool in podTepPools.iteritems():
        aciFabric.SetupP(fabricSetupPol, tepPool=tepPool, podId=podId)
    return controllerMo


def getDnFromPodIdNodeId(podId, nodeId):
    return "topology/pod-{}/node-{}".format(podId, nodeId)


def getPathEpFromPodIdNodeIdIfId(podId, nodeId, ifId):
    return "topology/pod-{}/paths-{}/pathep-[{}]".format(podId, nodeId, ifId)


def getExtL3DomDnFromDomainName(name):
    return "uni/l3dom-{}_extL3Dom".format(name)


def getPhysDomDnFromDomainName(name):
    return "uni/phys-{}_physDom".format(name)


def getVmmDomDnFromDomainName(name):
    return "uni/vmmp-VMware/dom-{}".format(name)


def getAAEPDnFromDomainName(name):
    return "uni/infra/attentp-{}_AAEP".format(name)


def getSpineIntPolGroupDnFromName(name):
    return "uni/infra/funcprof/spaccportgrp-{}".format(name)


def getLeafVpcIntPolGroupDnFromName(name):
    return "uni/infra/funcprof/accbundle-{}".format(name)


def getSpineIntProfileDnFromName(name):
    return "uni/infra/spaccportprof-{}".format(name)


def getLeafIntProfileDnFromName(name):
    return "uni/infra/accportprof-{}".format(name)


def getLldpIntPolicy(name):
    return "uni/infra/lldpIfP-{}".format(name)


def getCdpIntPolicy(name):
    return "uni/infra/cdpIfP-{}".format(name)


def getLacpIntPolicy(name):
    return "uni/infra/lacplagp-{}".format(name)


def getStaticVlanPoolDnFromName(name):
    return "uni/infra/vlanns-[{}_vlans]-static".format(name)


def createIpnL3Out(config):
    fvTenant = aciFv.Tenant(aciPol.Uni(''), name='infra')
    l3extOut = aciL3Ext.Out(fvTenant, name=config.l3OutName,
                            targetDscp='unspecified', enforceRtctrl='export')
    aciOspf.ExtP(l3extOut, areaId=config.ospfArea['id'],
                 areaType=config.ospfArea['type'])
    aciBgp.ExtP(l3extOut)
    aciL3Ext.RsEctx(l3extOut, tnFvCtxName='overlay-1')

    if config.l3Label:
        aciL3Ext.ProvLbl(l3extOut, tag='yellow-green', name=config.l3Label)

    if config.golfLabel:
        aciL3Ext.ProvLbl(l3extOut, tag='yellow-green', name=config.golfLabel)

    l3extInstP = aciL3Ext.InstP(l3extOut, prio='unspecified',
                                matchT='AtleastOne', name='instp1',
                                targetDscp='unspecified')
    aciFv.RsCustQosPol(l3extInstP, tnQosCustomPolName='')
    aciL3Ext.RsL3DomAtt(l3extOut,
                        tDn="uni/l3dom-{}_extL3Dom".format(config.l3OutName))
    fvFabricExtConnP = aciFv.FabricExtConnP(fvTenant, rt=config.routeTarget,
                                            id='1',
                                            name='Fabric_Ext_Conn_Pol1')
    aciFv.PeeringP(fvFabricExtConnP, type='automatic_with_full_mesh')
    fabricExtRoutingP = aciL3Ext.FabricExtRoutingP(fvFabricExtConnP,
                                                   name='ext_routing_prof_1')

    for podId, nodes in config.fabricNodes['pods'].iteritems():
        l3extLNodeP = aciL3Ext.LNodeP(l3extOut,
                                      name="POD{}-L3Nodes".format(podId))
        l3extLIfP = aciL3Ext.LIfP(l3extLNodeP, name='L3Out-InterfacePolicy')
        ospfIfP = aciOspf.IfP(l3extLIfP)
        aciOspf.RsIfPol(ospfIfP, tnOspfIfPolName=config.ospfIfPolicyName)
        fvPodConnP = aciFv.PodConnP(fvFabricExtConnP, id=podId,
                                    descr='this is dp-tep')
        aciFv.Ip(fvPodConnP, addr=config.podProxyTepIp[podId])

        if config.golfPeerList:
            for golfPeer in config.golfPeerList:
                if golfPeer['podId'] == 'all' and golfPeer['podId'] == podId:
                    bgpInfraPeerP = aciBgp.InfraPeerP(
                        l3extLNodeP, ctrl='send-com,send-ext-com', weight='0',
                        privateASctrl='', ttl=config.golfTtl,
                        allowedSelfAsCnt='3', peerT='wan', addr=golfPeer['ip'])
                    aciBgp.RsPeerPfxPol(bgpInfraPeerP, tnBgpPeerPfxPolName='')
                    aciBgp.AsP(bgpInfraPeerP, asn=config.golfAsn, name='')
        for node in nodes:
            if 'l3Out' in node:
                l3extRsNodeL3OutAtt = aciL3Ext.RsNodeL3OutAtt(
                    l3extLNodeP, rtrIdLoopBack='yes',
                    rtrId=node['l3Out']['routerId'],
                    tDn=getDnFromPodIdNodeId(podId, node['nodeId']))
                aciL3Ext.InfraNodeP(l3extRsNodeL3OutAtt,
                                    fabricExtCtrlPeering='yes', name='')
                for interface in node['l3Out']['interfaces']:
                    aciL3Ext.RsPathL3OutAtt(
                        l3extLIfP,
                        ifInstT='sub-interface',
                        addr=interface['addr'],
                        tDn=getPathEpFromPodIdNodeIdIfId(podId,
                                                         node['nodeId'],
                                                         interface['name']),
                        descr='asr',
                        encap='vlan-4')

    for subnet in config.ipnSubnetList:
        aciL3Ext.Subnet(fabricExtRoutingP, aggregate='', ip=subnet)

    return fvTenant


def configureBackupPolicy(config):
    fabricInst = aciFabric.Inst(aciPol.Uni(''))
    fileRemotePath = aciFile.RemotePath(fabricInst,
                                        userName=config['path']['user'],
                                        remotePort=config['path']['port'],
                                        protocol=config['path']['protocol'],
                                        name=config['path']['name'],
                                        descr=config['path']['descr'],
                                        userPasswd=config['path']['password'],
                                        host=config['path']['host'],
                                        remotePath=config['path']['remotePath']
                                        )
    aciFile.RsARemoteHostToEpg(fileRemotePath,
                               tDn='uni/tn-mgmt/mgmtp-default/oob-default')
    trigSchedP = aciTrig.SchedP(fabricInst, name=config['schedule']['name'])
    aciTrig.RecurrWindowP(trigSchedP, name=config['schedule']['period'],
                          hour=config['schedule']['hour'])
    configExportP = aciConfig.ExportP(fabricInst, name=config['name'],
                                      descr=config['descr'],
                                      adminSt='triggered')
    aciConfig.RsExportScheduler(configExportP,
                                tnTrigSchedPName=config['schedule']['name'])
    aciConfig.RsRemotePath(configExportP,
                           tnFileRemotePathName=config['path']['name'])
    return fabricInst


def createVlanPool(name, startVlan, endVlan, allocMode='static'):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    fvnsVlanInstP = aciFvns.VlanInstP(infraInfra, name="{}_vlans".format(name),
                                      allocMode=allocMode)
    aciFvns.EncapBlk(fvnsVlanInstP, to="vlan-{}".format(endVlan),
                     from_="vlan-{}".format(startVlan), name='encap')
    return fvnsVlanInstP


def addVlanBlockToPool(vlanPool, name, startVlan, endVlan, allocMode='static'):
    aciFvns.EncapBlk(vlanPool, to="vlan-{}".format(endVlan),
                     from_="vlan-{}".format(startVlan),
                     name='encap', allocMode=allocMode)
    return vlanPool


def createL3Domain(name, vlanPoolName=''):
    l3extDomP = aciL3Ext.DomP(aciPol.Uni(''), name="{}_extL3Dom".format(name))
    if vlanPoolName != '':
        aciInfra.RsVlanNs(l3extDomP,
                          tDn=getStaticVlanPoolDnFromName(vlanPoolName))
    return l3extDomP


def createPhysDomain(name, vlanPoolName):
    physDomP = phys.DomP(aciPol.Uni(''), name="{}_physDom".format(name))
    aciInfra.RsVlanNs(physDomP,
                      tDn=getStaticVlanPoolDnFromName(vlanPoolName))
    return physDomP


def createAAEP(name, domainDn):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraAAEP = aciInfra.AttEntityP(infraInfra, name="{}_AAEP".format(name))
    aciInfra.RsDomP(infraAAEP, tDn=domainDn)
    return infraAAEP


def createLinkLevelPolicy(linkLevelPolicyList):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    for linkLevelPolicy in linkLevelPolicyList:
        aciFabric.HIfPol(infraInfra, name=linkLevelPolicy['name'],
                         fecMode='inherit', autoNeg=linkLevelPolicy['autoNeg'],
                         speed=linkLevelPolicy['speed'], linkDebounce='100')
    return infraInfra


def createCdpPolicy():
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    cdp.IfPol(infraInfra, name='CDP_Enable', adminSt='enabled')
    cdp.IfPol(infraInfra, name='CDP_Disable', adminSt='disabled')
    return infraInfra


def createLldpPolicy():
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    lldp.IfPol(infraInfra, name='LLDP_Enable',
               adminTxSt='enabled', adminRxSt='enabled')
    lldp.IfPol(infraInfra, name='LLDP_Disable',
               adminTxSt='disabled', adminRxSt='disabled')
    return infraInfra


def createLacpPolicy():
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    lacp.LagPol(infraInfra, name='LACP_Active', minLinks='1',
                ctrl='fast-sel-hot-stdby,graceful-conv,susp-individual',
                maxLinks='16',
                mode='active')
    lacp.LagPol(infraInfra, name='LACP_Passive', minLinks='1',
                ctrl='fast-sel-hot-stdby,graceful-conv,susp-individual',
                maxLinks='16',
                mode='passive')
    lacp.LagPol(infraInfra, name='LACP_On', minLinks='1',
                ctrl='fast-sel-hot-stdby,graceful-conv,susp-individual',
                maxLinks='16',
                mode='off')
    return infraInfra


def createSpineInterfacePolGroup(name, cdpPolName, linkLevelPolName, aaepDn):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraFuncP = aciInfra.FuncP(infraInfra)
    infraSpAccPortGrp = aciInfra.SpAccPortGrp(infraFuncP, name=name)
    aciInfra.RsCdpIfPol(infraSpAccPortGrp, tnCdpIfPolName=cdpPolName)
    aciInfra.RsAttEntP(infraSpAccPortGrp, tDn=aaepDn)
    aciInfra.RsHIfPol(infraSpAccPortGrp, tnFabricHIfPolName=linkLevelPolName)
    return infraInfra


def createVpcInterfacePolGroup(name, cdpPolName, lldpPolName, linkLevelPolName,
                               lacpPolName, aaepDn):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraFuncP = aciInfra.FuncP(infraInfra)
    infraAccBndlGrp = aciInfra.AccBndlGrp(infraFuncP,
                                          name="{}_PolGrp".format(name),
                                          lagT=u'node')
    # aciInfra.RsL2IfPol(infraAccBndlGrp, tnL2IfPolName=u'')
    # aciInfra.RsQosPfcIfPol(infraAccBndlGrp, tnQosPfcIfPolName=u'')
    aciInfra.RsHIfPol(infraAccBndlGrp, tnFabricHIfPolName=linkLevelPolName)
    # aciInfra.RsL2PortSecurityPol(infraAccBndlGrp,
    # tnL2PortSecurityPolName=u'')
    # aciInfra.RsMonIfInfraPol(infraAccBndlGrp, tnMonInfraPolName=u'')
    # aciInfra.RsStpIfPol(infraAccBndlGrp, tnStpIfPolName=u'')
    # aciInfra.RsQosSdIfPol(infraAccBndlGrp, tnQosSdIfPolName=u'')
    aciInfra.RsAttEntP(infraAccBndlGrp, tDn=aaepDn)
    # aciInfra.RsMcpIfPol(infraAccBndlGrp, tnMcpIfPolName=u'')
    aciInfra.RsLacpPol(infraAccBndlGrp, tnLacpLagPolName=lacpPolName)
    # aciInfra.RsQosDppIfPol(infraAccBndlGrp, tnQosDppPolName=u'')
    # aciInfra.RsQosIngressDppIfPol(infraAccBndlGrp, tnQosDppPolName=u'')
    # aciInfra.RsStormctrlIfPol(infraAccBndlGrp, tnStormctrlIfPolName=u'')
    # aciInfra.RsQosEgressDppIfPol(infraAccBndlGrp, tnQosDppPolName=u'')
    # aciInfra.RsFcIfPol(infraAccBndlGrp, tnFcIfPolName=u'')
    aciInfra.RsLldpIfPol(infraAccBndlGrp, tnLldpIfPolName=lldpPolName)
    aciInfra.RsCdpIfPol(infraAccBndlGrp, tnCdpIfPolName=cdpPolName)
    return infraInfra


def createSpineInterfaceProfile(name, polGroupName, interfaceList):
    polGroupDn = getSpineIntPolGroupDnFromName(polGroupName)
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraSpAccPortP = aciInfra.SpAccPortP(infraInfra, name=name)
    infraSHPortS = aciInfra.SHPortS(infraSpAccPortP,
                                    type='range',
                                    name='Interface')
    i = 1
    for interface in interfaceList:
        (intCard, intPort) = interface['name'][3:].split('/')
        blockName = "block{}".format(i)
        aciInfra.PortBlk(infraSHPortS, name=blockName,
                         fromPort=str(intPort), fromCard=str(intCard),
                         toPort=str(intPort), toCard=str(intCard))
        i += 1
    aciInfra.RsSpAccGrp(infraSHPortS, tDn=polGroupDn)
    return infraInfra


def createLeafInterfaceProfile(name, interfaceList):
    polGroupDn = getLeafVpcIntPolGroupDnFromName("{}_PolGrp".format(name))
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraAccPortP = aciInfra.AccPortP(infraInfra,
                                      name="{}_IntProfile".format(name))
    infraHPortS = aciInfra.HPortS(infraAccPortP, type=u'range',
                                  name="{}_IfSel".format(name))
    aciInfra.RsAccBaseGrp(infraHPortS, fexId=u'101', tDn=polGroupDn)
    i = 1
    for interface in interfaceList:
        (intCard, intPort) = interface['name'][3:].split('/')
        blockName = "block{}".format(i)
        aciInfra.PortBlk(infraHPortS, name=blockName,
                         fromPort=str(intPort), fromCard=str(intCard),
                         toPort=str(intPort), toCard=str(intCard))
        i += 1
    return infraAccPortP


def createSpineSwitchProfile(fabricNodes, intProfileDn):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    infraSpineProfile = aciInfra.SpineP(infraInfra, name='Spines')

    for podId, nodes in fabricNodes['pods'].iteritems():
        infraSpineS = aciInfra.SpineS(infraSpineProfile, type='range',
                                      name="Spines_pod{}".format(podId))

        for node in nodes:
            if 'l3Out' in node:
                aciInfra.NodeBlk(infraSpineS, from_=node['nodeId'],
                                 name=node['name'], to_=node['nodeId'])

    aciInfra.RsSpAccPortP(infraSpineProfile, tDn=intProfileDn)
    return infraInfra


def createLeafSwitchProfile(leafIds, intProfileNameList):
    infraInfra = aciInfra.Infra(aciPol.Uni(''))
    leafIdString = "-".join(map(str, leafIds))
    name = "Leaf{}_Profile".format(leafIdString)
    infraNodeP = aciInfra.NodeP(infraInfra, name=name)
    infraLeafS = aciInfra.LeafS(infraNodeP, type=u'range',
                                name="{}_selector".format(name))
    count = 0
    for leafId in leafIds:
        aciInfra.NodeBlk(infraLeafS, from_=leafId,
                         name="single{}".format(count), to_=leafId)
        count += 1

    for intProfileName in intProfileNameList:
        intProfileDn = getLeafIntProfileDnFromName(intProfileName)
        aciInfra.RsAccPortP(infraNodeP, tDn=intProfileDn)

    return infraInfra


def createExportEncryptionKey(config):
    key = config.apic['password'] * 2
    pkiKey = aciPki.ExportEncryptionKey(aciPol.Uni(''),
                                        strongEncryptionEnabled='yes',
                                        passphrase=key)
    return pkiKey


def setDescrL1If(moDirectory, dn, descr):
    l1If = moDirectory.lookupByDn(dn)
    print l1If.id
    print l1If.descr
    l1If.descr = descr
    print l1If.descr
    return l1If


def getL1IfList(moDirectory, filter='', subFilter=''):
    q = aciRequest.ClassQuery('l1PhysIf')
    q.subtree = 'children'
    q.subClassFilter = 'ethpmPhysIf'
    if filter != '':
        q.propFilter = filter

    if subFilter != '':
        q.subtreePropFilter = subFilter

    intfs = moDirectory.query(q)
    return intfs


def getIfName(intf):
    # phy interface name is like phys-[eth1/98]
    name = None
    idx = None

    match = re.search('\[(eth\d+/\d+)\]', str(intf.dn))
    if match:
        name = match.group(1)
        match = re.search('(\d+)/(\d+)', name)
        if match:
            idx = 200*int(match.group(1)) + int(match.group(2))

    return name, idx


def getVlanPool(moDirectory, name):
    q = aciRequest.ClassQuery('fvnsVlanInstP')
    q.propFilter = 'eq(fvnsVlanInstP.name, "{0}")'.format(name)
    vlanPools = moDirectory.query(q)
    return vlanPools[0]


def readJsonDb(jsonDbFile):
    with open(jsonDbFile) as json_data:
        return json.load(json_data)


def writeJsonDb(jsonDbFile, dbDict):
    with open(jsonDbFile, 'w') as outJsonFile:
        json.dump(dbDict, outJsonFile)


def mergeDbWithIfList(dbDict, ifList):
    newDbDict = {}
    for interface in ifList:
        if interface.dn in dbDict:
            newDbDict[str(interface.dn)] = dbDict[str(interface.dn)]
        else:
            newDbDict[str(interface.dn)] = {'ackOperSt': '', 'ackAdminSt': ''}
    return newDbDict


def shutInterface(moDirectory, dn):
    pathDn = pathEpDnFromL1PhysIfDn(dn)
    outOfSvc = moDirectory.lookupByDn('uni/fabric/outofsvc')
    aciFabric.RsOosPath(outOfSvc, tDn=pathDn, lc=u'blacklist')
    return outOfSvc


def unShutInterface(moDirectory, dn):
    pathDn = pathEpDnFromL1PhysIfDn(dn)
    q = aciRequest.ClassQuery('fabricRsOosPath')
    q.propFilter = 'eq(fabricRsOosPath.tDn, "{0}")'.format(pathDn)
    rsOosPath = moDirectory.query(q)
    rsOosPath[0].delete()
    return rsOosPath[0]


def getEpgList(moDirectory):
    epgList = moDirectory.lookupByClass("fvAEPg")
    epgDnList = []
    for epg in epgList:
        epgDnList.append(str(epg.dn))
    return epgDnList


def getIfDnToEpgMapping(dbEpToEPG):
    IfDnToEpgList = {}
    for epgDn, info in dbEpToEPG.iteritems():
        for interface in info['portList']:
            IfDnToEpgList[interface] = epgDn
    return IfDnToEpgList


def getMacToEpgMapping(dbEpToEPG):
    macToEpgList = {}
    for epgDn, info in dbEpToEPG.iteritems():
        for mac in info['macList']:
            macToEpgList[mac] = epgDn
    return macToEpgList


def setStaticBindingForEpg(moDirectory, ifDn, epgDn, vlanId, physDomainDn):
    epg = moDirectory.lookupByDn(epgDn)
    aciFv.RsDomAtt(epg, tDn=physDomainDn, primaryEncap='unknown',
                   classPref='encap', delimiter='', instrImedcy='immediate',
                   encap='unknown', encapMode='auto', resImedcy='immediate')
    aciFv.RsPathAtt(epg, tDn=pathEpDnFromL1PhysIfDn(ifDn),
                    primaryEncap='unknown', instrImedcy='immediate',
                    mode='native', encap="vlan-{}".format(vlanId))
    return epg


def autoMapEpgBindings(moDirectory, dbEpToEpgDict, dbForMacMapping,
                       quarantineConfig):
    moList = []
    dnToEpgMap = getIfDnToEpgMapping(dbEpToEpgDict)
    discoveryIfList = getDiscoveryInterfaceList(moDirectory)
    for ifDn in discoveryIfList:
        if ifDn in dnToEpgMap:
            epgDn = dnToEpgMap[ifDn]
            moList.append(
                setStaticBindingForEpg(moDirectory, ifDn, epgDn,
                                       dbEpToEpgDict[epgDn]['vlanId'],
                                       dbEpToEpgDict[epgDn]['physDomain']))
        elif ifDn in dbForMacMapping:
            moList.append(
                setStaticBindingForEpg(moDirectory, ifDn,
                                       quarantineConfig['epgDn'],
                                       quarantineConfig['vlanId'],
                                       quarantineConfig['physDomain']))
    return moList


def autoMapMacBindings(moDirectory, dbEpToEpgDict, dbForMacMapping,
                       quarantineConfig):
    moList = []
    macToEpgMap = getMacToEpgMapping(dbEpToEpgDict)
    epMacToIfList = getMacEpFromQuarantine(moDirectory,
                                           quarantineConfig['epgDn'])
    for mac, epgDn in macToEpgMap.iteritems():
        if mac in epMacToIfList and epMacToIfList[mac] in dbForMacMapping:
            moList.append(removeStaticBindingForEpg(moDirectory,
                                                    epMacToIfList[mac],
                                                    quarantineConfig['epgDn']))
            moList.append(
                setStaticBindingForEpg(moDirectory,
                                       epMacToIfList[mac],
                                       epgDn,
                                       dbEpToEpgDict[epgDn]['vlanId'],
                                       dbEpToEpgDict[epgDn]['physDomain']))
    return moList


def removeStaticBindingForEpg(moDirectory, l1IfDn, epgDn):
    binding = getStaticBindingFromEpg(moDirectory, l1IfDn, epgDn)
    binding.delete()
    return binding


def getEpPathFromEpg(moDirectory, epgDn):
    q = aciRequest.DnQuery(epgDn)
    q.subtree = 'children'
    q.queryTarget = 'children'
    q.classFilter = 'fvCEp'
    q.subtreeClassFilter = 'fvRsCEpToPathEp'
    return moDirectory.query(q)


def getStaticBindingFromEpg(moDirectory, l1IfDn, epgDn):
    q = aciRequest.DnQuery(epgDn)
    q.queryTarget = 'children'
    q.classFilter = 'fvRsPathAtt'
    q.propFilter = 'eq(fvRsPathAtt.tDn, "{0}")'.format(
        pathEpDnFromL1PhysIfDn(l1IfDn))
    results = moDirectory.query(q)
    return results[0]


def getEpFromMac(moDirectory, mac, epgDn):
    q = aciRequest.DnQuery(epgDn)
    q.queryTarget = 'children'
    q.classFilter = 'fvCEp'
    q.propFilter = 'eq(fvCEp.mac, "{0}")'.format(mac)
    results = moDirectory.query(q)
    return results[0]


def getMacFromEpPath(epList):
    macToDnList = {}
    for endpoint in epList:
        epMac = endpoint.mac
        for child in endpoint.children:
            ifDn = l1PhysIfDnFromPathEpDn(child.tDn)
            macToDnList[epMac] = ifDn
    return macToDnList


def getMacEpFromQuarantine(moDirectory, quarantineDn):
    return getMacFromEpPath(getEpPathFromEpg(moDirectory, quarantineDn))


def pathEpDnFromL1PhysIfDn(dn):
    return dn.replace('node', 'paths').replace('sys/phys', 'pathep')


def l1PhysIfDnFromPathEpDn(dn):
    return dn.replace('paths', 'node').replace('pathep', 'sys/phys')


def splitPathEpDn(dn):
    output = {}
    dnSplit = dn.split("/pathep-")
    rnList = dnSplit[0].split("/")
    output['podId'] = rnList[1].split("-")[1]
    output['leafId'] = rnList[2].split("-")[1]
    output['ifName'] = dnSplit[1][1:-1]
    return output


def splitIfDn(dn):
    output = {}
    dnSplit = dn.split("/sys/")
    rnList = dnSplit[0].split("/")
    output['podId'] = rnList[1].split("-")[1]
    output['leafId'] = rnList[2].split("-")[1]
    output['ifName'] = dnSplit[1].split("-")[1][1:-1]
    return output


def getStateChangeIfList(moDirectory, dbDict):
    ifList = getIfList(moDirectory, dbDict)
    changedIfList = {}
    for dn, interface in ifList.iteritems():
        if (interface['ackOperSt'] != interface['operSt'] or
                interface['ackAdminSt'] != interface['adminSt']):
            changedIfList[dn] = interface
    return changedIfList


def getIfList(moDirectory, dbDict):
    ifList = getL1IfList(moDirectory, 'eq(l1PhysIf.portT, "leaf")')
    newIfList = {}
    for interface in ifList:
        ifDn = str(interface.dn)
        if ifDn in dbDict:
            newIfList[ifDn] = dbDict[ifDn]
            newIfList[ifDn]['adminSt'] = interface.adminSt
            newIfList[ifDn]['usage'] = interface.usage
            newIfList[ifDn]['modTime'] = interface.modTs
            for child in interface.children:
                if child.rn == 'phys':
                    newIfList[ifDn]['operSt'] = child.operSt
        else:
            newIfList[ifDn] = {'ackOperSt': '', 'ackAdminSt': ''}
            newIfList[ifDn]['adminSt'] = interface.adminSt
            newIfList[ifDn]['usage'] = interface.usage
            newIfList[ifDn]['modTime'] = interface.modTs
            for child in interface.children:
                if child.rn == 'phys':
                    newIfList[ifDn]['operSt'] = child.operSt
    return newIfList


def ackState(dn, stName, dbDict, ifDict, jsonDbFile):
    if stName == 'adminSt':
        dbDict[dn]['ackAdminSt'] = ifDict[dn]['adminSt']
    if stName == 'operSt':
        dbDict[dn]['ackOperSt'] = ifDict[dn]['operSt']
    writeJsonDb(jsonDbFile, dbDict)


def ackAll(dbDict, ifDict, jsonDbFile):
    for dn, interface in dbDict.iteritems():
        interface['ackAdminSt'] = ifDict[dn]['adminSt']
        interface['ackOperSt'] = ifDict[dn]['operSt']
    writeJsonDb(jsonDbFile, dbDict)


def ackAllInterface(dn, dbDict, ifDict, jsonDbFile):
    dbDict[dn]['ackAdminSt'] = ifDict[dn]['adminSt']
    dbDict[dn]['ackOperSt'] = ifDict[dn]['operSt']
    writeJsonDb(jsonDbFile, dbDict)


def getDiscoveryInterfaceList(moDirectory):
    ifList = getL1IfList(moDirectory, filter='eq(l1PhysIf.portT, "leaf")')
    discoveryIfList = []
    for interface in ifList:
        if interface.usage == 'discovery':
            for child in interface.children:
                if child.rn == 'phys' and child.operSt == 'up':
                    ifDn = str(interface.dn)
                    discoveryIfList.append(ifDn)
    return discoveryIfList


def getfvRsPathAttList(moDirectory, pathEpDn):
    q = aciRequest.ClassQuery('fvRsPathAtt')
    q.propFilter = 'eq(fvRsPathAtt.tDn,"{}")'.format(pathEpDn)
    fvRsPathAttList = moDirectory.query(q)
    return not fvRsPathAttList


def removeStaticBindingFromDownNodes(moDirectory, listIfs):
    bindingList = moDirectory.lookupByClass("fvRsPathAtt")
    moList = []
    for binding in bindingList:
        ifDn = l1PhysIfDnFromPathEpDn(binding.tDn)
        if ifDn in listIfs:
            if getInterfaceOperStatus(moDirectory, ifDn) == 'down':
                binding.delete()
                moList.append(binding)
    return moList


def getInterfaceOperStatus(moDirectory, ifDn):
    interfaceList = getL1IfFromDn(moDirectory, ifDn)
    interface = interfaceList[0]
    for child in interface.children:
        if child.rn == 'phys':
            return child.operSt


def getL1IfFromDn(moDirectory, ifDn):
    q = aciRequest.DnQuery(ifDn)
    q.subtree = 'children'
    q.subClassFilter = 'ethpmPhysIf'
    intfs = moDirectory.query(q)
    return intfs


def createVpcDomainPairs(moDirectory, vpcList):
    fabricProtPol = moDirectory.lookupByDn('uni/fabric/protpol')
    for vpcId, nodeList in vpcList.iteritems():
        explicitGEp = aciFabric.ExplicitGEp(fabricProtPol,
                                            id=str(vpcId),
                                            name="vpcDomain-{}".format(vpcId))
        print nodeList
        for node in nodeList:
                aciFabric.NodePEp(explicitGEp, id=str(node['nodeId']))
    return fabricProtPol


def createVmmDomain(moDirectory, vlanPoolDn, vSphereConfig):
    vmmProvP = moDirectory.lookupByDn('uni/vmmp-VMware')
    vmmDomP = vmm.DomP(vmmProvP, name=vSphereConfig['vSwitch'])
    vmmUsrAccp = vmm.UsrAccP(vmmDomP,
                             "{}_credential".format(vSphereConfig['name']),
                             usr=vSphereConfig['user'],
                             pwd=vSphereConfig['password'])
    aciInfra.RsVlanNs(vmmDomP, tDn=vlanPoolDn)
    vmmCtrlrP = vmm.CtrlrP(vmmDomP,
                           vSphereConfig['name'],
                           rootContName=vSphereConfig['datacenter'],
                           dvsVersion=vSphereConfig['version'],
                           hostOrIp=vSphereConfig['ip'])
    vmm.RsAcc(vmmCtrlrP, tDn=vmmUsrAccp.dn)
    vmmVSwitchPolicyCont = vmm.VSwitchPolicyCont(vmmDomP)
    vmm.RsVswitchOverrideCdpIfPol(vmmVSwitchPolicyCont,
                                  tDn=getCdpIntPolicy('CDP_Enable'))
    vmm.RsVswitchOverrideLldpIfPol(vmmVSwitchPolicyCont,
                                   tDn=getLldpIntPolicy('LLDP_Enable'))
    vmm.RsVswitchOverrideLacpPol(vmmVSwitchPolicyCont,
                                 tDn=getLacpIntPolicy('LACP_Active'))
    return vmmDomP
