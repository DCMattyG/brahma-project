#!/usr/bin/env python
"""
At this phase, we need two sets of credentials:
  - APIC IP, Username, Password
  - Brahma IP, Token
For MVP, these are hardcoded into a config file (config.py)

"""


# Library support
from cobra.internal.codec.xmlcodec import toXMLStr
from brahma.functions import getMoDirectoryFromApic as aciLogin
import cobra.model.fabric as aciFabric
import cobra.mit.request as aciRequest
import cobra.model.infra as aciInfra
import cobra.model.pol as aciPol
import cobra.model.bgp as aciBgp
import cobra.model.coop as aciCoop
import cobra.model.ep as aciEp
import cobra.model.dns as aciDNS
import cobra.model.datetime as aciNtp
import cobra.model.syslog as aciSyslog
import cobra.model.file as aciFile
from cobra.model import cdp
from cobra.model import mcp
from cobra.model import lldp
from cobra.model import snmp


# Connection information
import config
import sample

cdp_attributes = ['name', 'adminSt']
lldp_attributes = ['name', 'adminRxSt', 'adminTxSt']
link_level_attributes = ['name', 'autoNeg', 'speed']
mcp_attributes = ['name', 'adminSt']
snmp_attributes = ['name', 'adminSt', 'contact', 'loc']
coop_attributes = ['name', 'type']
rogue_endpoint_attributes = [
  'name', 'adminSt', 'holdIntvl', 'rogueEpDetectIntvl', 'rogueEpDetectMult'
]
ip_aging_attributes = ['name', 'adminSt']
fabric_wide_attributes = ['name', 'domainValidation', 'enforceSubnetCheck']
bgp_attributes = {
  'bgpInstPol': {
    'name': None,
    'bgpAsP': ['asn'],
    'bgpRRP': ['podId', 'bgpRRNodePEp']
  },
}
dns_attributes = {
  'dnsProfile': {
    'name': None,
    'epgDn': None,
    'dnsProv': ['addr', 'preferred'],
    'dnsDomain': ['name', 'isDefault']
  },
}
ntp_provider_attributes = ['name', 'minPoll', 'maxPoll', 'preferred']
ntp_auth_key_attributes = ['key', 'keyType', 'trusted']
ntp_attributes = {
  'datetimePol': {
    'name': None,
    'adminSt': None,
    'authSt': None,
    'serverState': None,
    'masterMode': None,
    'datetimeNtpProv': ntp_provider_attributes + ntp_auth_key_attributes
  }
}
syslog_attributes = {
  'syslogGroup': {
    'name': None,
    'format': None,
    'includeMilliSeconds': None,
    'syslogRemoteDest': [
      'name', 'host', 'port', 'adminState', 'format', 'severity', 'forwardingFacility'
    ],
    'syslogProf': ['name', 'adminState'],
    'syslogFile': ['adminState', 'format', 'severity'],
    'syslogConsole': ['adminState', 'format', 'severity']
  }
}

def reconcile(current, desired, attributes):
  """
  Important to note: Current is the MO from APIC,
  desired is the dictionary with attributes and values.

  Assumes required attributes are in desired keys.
  """

  for a in attributes:
    c = getattr(current, a)
    d = desired[a]
    if c != d:
      return False
  return True

def required_attributes(attributes, keys):
  for a in attributes:
    if a not in keys:
      raise Exception('Missing required {0}'.format(a))

def create_cdp_policy(mo, policy):
  # Validate input
  required_attributes(cdp_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  cdp.IfPol(mo, name=policy['name'], adminSt=policy['adminSt'])
  return mo

def create_mcp_policy(mo, policy):
  # Validate input
  required_attributes(mcp_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  mcp.IfPol(mo, name=policy['name'], adminSt=policy['adminSt'])
  return mo

def create_lldp_policy(mo, policy):
  # Validate input
  required_attributes(lldp_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  lldp.IfPol(mo, name=policy['name'], 
            adminRxSt=policy['adminRxSt'], adminTxSt=policy['adminTxSt']
            )
  return mo

def create_link_level_policy(mo, policy):
  # Validate input
  required_attributes(link_level_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  aciFabric.HIfPol(
    mo, name=policy['name'], autoNeg=policy['autoNeg'], speed=policy['speed'],
    fecMode=policy['fecMode'], linkDebounce=policy['linkDebounce']
  )

  return mo

def create_coop_policy(mo, policy):
  # Validate input
  required_attributes(coop_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  aciCoop.Pol(mo, name=policy['name'], type=policy['type'])

  return mo

def create_rogue_policy(mo, policy):
  # Validate input
  required_attributes(rogue_endpoint_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  aciEp.ControlP(
    mo, name=policy['name'], adminSt=policy['adminSt'],
    holdIntvl=policy['holdIntvl'],
    rogueEpDetectIntvl=policy['rogueEpDetectIntvl'],
    rogueEpDetectMult=policy['rogueEpDetectMult']
  )

  return mo

def create_aging_policy(mo, policy):
  # Validate input
  required_attributes(ip_aging_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  aciEp.IpAgingP(mo, name=policy['name'], adminSt=policy['adminSt'])

  return mo

def create_wide_policy(mo, policy):
  # Validate input
  required_attributes(fabric_wide_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciInfra.Infra(aciPol.Uni(''))

  aciInfra.SetPol(
    mo, name=policy['name'],
    domainValidation=policy['domainValidation'],
    enforceSubnetCheck=policy['enforceSubnetCheck']
  )

  return mo

def create_snmp_policy(mo, policy):
  # Validate input
  required_attributes(snmp_attributes, list(policy.keys()))

  # Create new object if needed
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  snmp.Pol(
    mo, name=policy['name'], adminSt=policy['adminSt'],
    contact=policy['contact'], loc=policy['loc']
  )

  return mo


def validate(attributes, policy):
  """
  validate() is designed to ensure I get the data required from
  SaaS in order to correctly configure a policy locally.

  Wrote this 50-60% of the way through... this method should be
  the generic version of 'required_attributes'.  Does require
  rethinking the existing (cdp, lldp, link_level, mcp, and snmp)
  attributes and the create methods. "Road map" :)
  """

  keys = list(policy.keys())
  for parent, children in attributes.items():
    # Bottom of tree
    if children is None:
      if parent not in keys:
        raise Exception('Missing required {0}'.format(parent))
      continue

    # parent is class name.  If children is list, we are at bottom
    if isinstance(children, list):
      if isinstance(policy[parent], list):
        sub_keys = list(policy[parent][0].keys())
      else:
        sub_keys = list(policy[parent].keys())

      for c in children:
        if c not in sub_keys:
          print(parent, children, c, sub_keys)
          raise Exception('Missing required {0}'.format(c))
      continue

    # There's further structure down the tree.  Recursively descend
    validate(children, policy[parent])

def create_dns_policy(mo, policy):
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  dnsProfile = aciDNS.Profile(mo, name=policy['name'])
  aciDNS.RsProfileToEpg(
    dnsProfile, tDn='uni/tn-mgmt/mgmtp-default/oob-default'
  )

  for provider in policy['dnsProv']:
    aciDNS.Prov(
      dnsProfile, addr=provider['addr'], preferred=provider['preferred']
    )

  for domain in policy['dnsDomain']:
    aciDNS.Domain(
      dnsProfile, name=domain['name'], isDefault=domain['isDefault']
    )

  return mo

def reconcile_dns_policy(apic, mo, policy, mo_changes):
  # Validate input
  validate(dns_attributes['dnsProfile'], policy)

  # Name already validate as part of DN match, record Dn
  moDn = str(mo.dn)

  # Find all DNS providers with the moDn as parent
  providers = apic.lookupByClass('dnsProv')
  my_providers = dict(
    [p.addr, p.preferred] for p in providers if str(p._parentDn()) == moDn
  )

  # Validate the providers are correct
  for p in policy['dnsProv']:
    if p['addr'] not in my_providers:
      mo_changes = create_dns_policy(mo_changes, policy)
      return mo_changes

    if my_providers[p['addr']] != p['preferred']:
      mo_changes = create_dns_policy(mo_changes, policy)
      return mo_changes

  # Find all DNS domains with the moDn as parent
  domains = apic.lookupByClass('dnsDomain')
  my_domains = dict(
    [d.name, d.isDefault] for d in domains if str(d._parentDn()) == moDn
  )

  # Validate the domains are correct
  for d in policy['dnsDomain']:
    if d['name'] not in my_domains:
      mo_changes = create_dns_policy(mo_changes, policy)
      return mo_changes

    if my_domains[d['name']] != d['isDefault']:
      mo_changes = create_dns_policy(mo_changes, policy)
      return mo_changes

  return None

def create_bgp_policy(mo, policy, nodes):
  """
  If nodes is passed, it's a dictionary of "name": "id" info for the
  fabric nodes (non-controller)
  """
  # Create new object if needed
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  # Create top level BGP policy
  bgpInstPol = aciBgp.InstPol(mo, name=policy['name'])

  # Add ASN daughter
  aciBgp.AsP(bgpInstPol, asn=policy['bgpAsP']['asn'])

  # Add BGP (Internal) RR Fabric Policy
  aciRRP = aciBgp.RRP(bgpInstPol)

  # Add BGP (Internal) RR node
  podId = policy['bgpRRP']['podId']
  for rr in policy['bgpRRP']['bgpRRNodePEp']:
    nodeId = nodes[rr]
    aciBgp.RRNodePEp(aciRRP, id=nodeId, podId=podId)

  return mo

def reconcile_bgp_policy(apic, mo, policy, mo_changes):
  """
  Assume explicit knowledge of policy.  If we get here, we know that
  the top level bgpInstPol name attribute is equivalent (DNs matched).
  The rest is looking at the children.
  """

  # Validate input (top level policy)
  validate(bgp_attributes['bgpInstPol'], policy)

  # Get Fabric Nodes
  fabricNodes = apic.lookupByClass('fabricNode')
  nodes = dict([n.name, n.id] for n in fabricNodes)

  # DN for the MO
  moDn = str(mo.dn)

  # Is the ASN correct
  bgpAsP = apic.lookupByClass('bgpAsP')
  parentDNs = [str(b._parentDn()) for b in bgpAsP]
 
  if moDn not in parentDNs:
    mo_changes = create_bgp_policy(mo_changes, policy, nodes)
    return mo_changes

  asnIdx = parentDNs.index(str(mo.dn))
  if bgpAsP[asnIdx].asn != policy['bgpAsP']['asn']:
    mo_changes = create_bgp_policy(mo_changes, policy, nodes)
    return mo_changes

  # Are the route reflector nodes correct
  bgpRRP = apic.lookupByClass('bgpRRP')
  parentDNs = [str(b._parentDn()) for b in bgpRRP]
  if moDn not in parentDNs:
    mo_changes = create_bgp_policy(mo_changes, policy, nodes)
    return mo_changes

  rrpIdx = parentDNs.index(str(mo.dn))
  bgpRRPdn = str(bgpRRP[rrpIdx].dn)

  # Get RR nodes (gives me podId and id)
  rrEp = apic.lookupByClass('bgpRRNodePEp')
  rrNodes = [(b.id, b.podId) for b in rrEp if str(b._parentDn()) == bgpRRPdn]

  if len(rrNodes) == 0:
    mo_changes = create_bgp_policy(mo_changes, policy, nodes)
    return mo_changes

  # Fetch desired podId
  podId = policy['bgpRRP']['podId']

  # Loop through the RR node requirements
  for endPt in policy['bgpRRP']['bgpRRNodePEp']:
    if endPt not in nodes:
      raise Exception('Node not found {0}'.format(endPt))
    id = nodes[endPt]
    if (id, podId) not in rrNodes:
      print('missing node', (id,podId))
      mo_changes = create_bgp_policy(mo_changes, policy, nodes)
      return mo_changes

  return None

def create_ntp_policy(mo, policy):
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  datetimePol = aciNtp.Pol(
    mo, name=policy['name'], adminSt=policy['adminSt'],
    authSt=policy['authSt'], serverState=policy['serverState'],
    masterMode=policy['masterMode']
  )

  for id, prov in enumerate(policy['datetimeNtpProv']):
    aciNtp.NtpAuthKey(
      datetimePol, id=str(id+1),
      key=prov['key'], keyType=prov['keyType'], trusted=prov['trusted']
    )

    prov = aciNtp.NtpProv(
      datetimePol, name=prov['name'], preferred=prov['preferred'],
      minPoll=prov['minPoll'], maxPoll=prov['maxPoll'], keyId=str(id+1)
    )

    aciNtp.RsNtpProvToNtpAuthKey(prov, tnDatetimeNtpAuthKeyId=str(id+1))
    aciNtp.RsNtpProvToEpg(prov, tDn='uni/tn-mgmt/mgmtp-default/oob-default')

  return mo

def reconcile_ntp_policy(apic, mo, policy, mo_changes):
  # Validate input
  validate(ntp_attributes['datetimePol'], policy)

  # Check parent policy attributes
  attrs = [k for k, v in ntp_attributes['datetimePol'].items() if v is None]
  if not reconcile(mo, policy, attrs):
    mo_changes = create_ntp_policy(mo_changes, policy)
    return mo_changes

  # "parentDn" of the children
  polDn = str(mo.dn)

  # Fetch keys first, since we need their key ids to check the providers
  datetimeNtpAuthKey = apic.lookupByClass('datetimeNtpAuthKey')
  authKeys = dict(
    [k.key, k] for k in datetimeNtpAuthKey if str(k._parentDn()) == polDn
  )

  # There are no keys, create policy
  if not authKeys:
    mo_changes = create_ntp_policy(mo_changes, policy)
    return mo_changes

  # Check auth key attributes
  keyIdMap = {}
  ntpProvAndKeys = policy['datetimeNtpProv']
  for desired in ntpProvAndKeys:
    if desired['key'] not in authKeys:
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

    current = authKeys[desired['key']]
    if not reconcile(current, desired, ntp_auth_key_attributes):
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

    # The current MO and the desired match, so let's record key id
    keyIdMap[desired['key']] = current.id

  # Auth Keys in Sync, Validate Providers

  # Fetch providers, ensure matching parentDN
  datetimeNtpProv = apic.lookupByClass('datetimeNtpProv')
  ntpProv = dict(
    [p.name, p] for p in datetimeNtpProv if str(p._parentDn()) == polDn
  )

  # There are no providers, create policy
  if not ntpProv:
    mo_changes = create_ntp_policy(mo_changes, policy)
    return mo_changes

  # Loop over providers and check attributes
  for desired in policy['datetimeNtpProv']:

    # If the desired provider doesn't exist, create policy
    if desired['name'] not in ntpProv:
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

    # If it exists but doesn't match settings, create policy
    current = ntpProv[desired['name']]
    if not reconcile(current, desired, ntp_provider_attributes):
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

    # Fetch all mapped keys to providers
    currDn = str(current.dn)
    keyMap = apic.lookupByClass('datetimeRsNtpProvToNtpAuthKey')
    currKeys = [
      k.tnDatetimeNtpAuthKeyId for k in keyMap if str(k._parentDn()) == currDn
    ]

    # If current provider has no mapped keys, create policy
    if not currKeys:
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

    desiredKeyId = keyIdMap[desired['key']]
    if desiredKeyId not in currKeys:
      mo_changes = create_ntp_policy(mo_changes, policy)
      return mo_changes

  return None

def create_syslog_policy(mo, policy):
  if mo is None:
    mo = aciFabric.Inst(aciPol.Uni(''))

  slGrp = aciSyslog.Group(
    mo, name=policy['name'], format=policy['format'],
    includeMilliSeconds=policy['includeMilliSeconds']
  )

  p = policy['syslogProf']
  aciSyslog.Prof(slGrp, name=p['name'], adminState=p['adminState'])

  p = policy['syslogFile']
  aciSyslog.File(
    slGrp, adminState=p['adminState'], format=p['format'],
    severity=p['severity']
  )

  p = policy['syslogConsole']
  aciSyslog.Console(
    slGrp, adminState=p['adminState'], format=p['format'],
    severity=p['severity']
  )

  # Remote destinations
  for d in policy['syslogRemoteDest']:
    dest = aciSyslog.RemoteDest(
      slGrp, name=d['name'], host=d['host'], port=d['port'],
      adminState=d['adminState'], format=d['format'],
      severity=d['severity'], forwardingFacility=d['forwardingFacility']
    )

    aciFile.RsARemoteHostToEpg(
      dest, tDn='uni/tn-mgmt/mgmtp-default/oob-default'
    )

  return mo

def reconcile_syslog_policy(apic, mo, policy, mo_changes):
  """
  Deferred
  """
  # Validate input (top level policy)
  validate(syslog_attributes['syslogGroup'], policy)

  return create_syslog_policy(mo_changes, policy)

def apply_nested_policy(
  apic=None, policies=None, baseDN=None,
  className=None, create=None, reconcile=None
  ):
  """
  policies are the defined state from the SaaS service
  """

  mo_changes = None

  # Fetch existing policies from APIC
  existing = apic.lookupByClass(className)
  eDN = [ str(e.dn) for e in existing ]

  # Loop over each policies to be defined
  for p in policies:
    pDN = baseDN.format(p['name'])

    # New policy
    if pDN not in eDN:
      mo_changes = create(mo_changes, p)
      continue

    # Existing Policy
    i = eDN.index(pDN)

    # Merging reconciliation with created changed mo 
    changes = reconcile(apic, existing[i], p, mo_changes)
    if changes:
      mo_changes = changes

  return mo_changes

def apply_policy(
  apic=None, policies=None, baseDN=None, 
  className=None, attrs=None, create=None,
  exactDN=None
  ):
  """
  Policies are entries that need to exist in APIC.
  """

  mo_changes = None

  # Fetch existing policies from APIC
  existing = apic.lookupByClass(className)
  eDN = [ str(e.dn) for e in existing ]

  # Loop over each policies to be defined
  for p in policies:
    if exactDN:
      pDN = exactDN
    else:
      pDN = baseDN.format(p['name'])

    # New policy
    if pDN not in eDN:
      mo_changes = create(mo_changes, p)
      continue

    # Existing Policy
    i = eDN.index(pDN)

    # No changes needed
    if reconcile(existing[i], p, attrs):
      continue

    # Changes required
    mo_changes = create(mo_changes, p)

  return mo_changes


if __name__ == '__main__':

  # Create connection to APIC
  apic1 = aciLogin(config.apic)
  cfgRequest = aciRequest.ConfigRequest()

  # CDP
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['cdp_policies'],
    baseDN='uni/infra/cdpIfP-{0}', className='cdpIfPol',
    attrs=cdp_attributes, create=create_cdp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # LLDP
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['lldp_policies'],
    baseDN='uni/infra/lldpIfP-{0}', className='lldpIfPol',
    attrs=lldp_attributes, create=create_lldp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # Link Level Policies

  #  Need to add default values
  for policy in sample.state['link_level_policies']:
    if 'fecMode' not in policy:
      policy['fecMode'] = 'inherit'
    if 'linkDebounce' not in policy:
      policy['linkDebounce'] = '100'
    
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['link_level_policies'],
    baseDN=	'uni/infra/hintfpol-{0}', className='fabricHIfPol',
    attrs=link_level_attributes, create=create_link_level_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # MCP Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['mcp_policies'],
    baseDN='uni/infra/mcpIfP-{0}', className='mcpIfPol',
    attrs=mcp_attributes, create=create_mcp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # COOP Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['coop_group_policies'],
    baseDN='uni/fabric/pol-{0}', className='coopPol',
    attrs=coop_attributes, create=create_coop_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # Rogue Endpoint Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['rogue_endpoint_policies'],
    baseDN='uni/infra/epCtrlP-{0}', className='epControlP',
    attrs=rogue_endpoint_attributes, create=create_rogue_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # IP Aging Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['ip_aging_policies'],
    baseDN='uni/infra/ipAgingP-{0}', className='epIpAgingP',
    attrs=ip_aging_attributes, create=create_aging_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # Fabric Wide System Settings
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['fabric_wide_policies'],
    exactDN='uni/infra/settings', className='infraSetPol',
    attrs=fabric_wide_attributes, create=create_wide_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # SNMP Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['snmp_policies'],
    baseDN='uni/fabric/snmppol-{0}', className='snmpPol',
    attrs=snmp_attributes, create=create_snmp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  ### Hierarchy of objects

  # BGP RR Policies (custom method for nested)
  mo_changes = apply_nested_policy(
    apic=apic1, policies=sample.state['bgp_policies'],
    baseDN='uni/fabric/bgpInstP-{0}', className='bgpInstPol',
    create=create_bgp_policy, reconcile=reconcile_bgp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # DNS Policies
  mo_changes = apply_nested_policy(
    apic=apic1, policies=sample.state['dns_policies'],
    baseDN='uni/fabric/dnsp-{0}', className='dnsProfile',
    create=create_dns_policy, reconcile=reconcile_dns_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # NTP Policies
  mo_changes = apply_nested_policy(
    apic=apic1, policies=sample.state['ntp_policies'],
    baseDN='uni/fabric/time-{0}', className='datetimePol',
    create=create_ntp_policy, reconcile=reconcile_ntp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # Syslog Policies
  mo_changes = apply_nested_policy(
    apic=apic1, policies=sample.state['syslog_policies'],
    baseDN='uni/fabric/slgroup-{0}', className='syslogGroup',
    create=create_syslog_policy, reconcile=reconcile_syslog_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  if cfgRequest.configMos:
    apic1.commit(cfgRequest)
