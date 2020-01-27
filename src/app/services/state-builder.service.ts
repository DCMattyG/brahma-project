import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StateBuilderService {

  constructor(private http: HttpClient) { }

  state = {};

  buildState(stateData) {
    this.state['bgp_policies'] = this.buildBgp(stateData['nodes'], stateData['global']);
    this.state['dns_policies'] = this.buildDns();
    this.state['coop_group_policies'] = this.buildCoop(stateData['global']);
    this.state['rogue_endpoint_policies'] = this.buildRogue(stateData['global']);
    this.state['ip_aging_policies'] = this.buildIpAging(stateData['global']);
    this.state['fabric_wide_policies'] = this.buildSubnetCheck(stateData['global']);
    this.state['cdp_policies'] = this.buildCdpPolicies();
    this.state['lldp_policies'] = this.buildLldpPolicies();
    this.state['link_level_policies'] = this.buildLinkLevelPolicies();
    this.state['mcp_policies'] = this.buildMcpPolicies();
    this.state['snmp_policies'] = this.buildSnmpPolicies(stateData['snmp']);
    this.state['snmp_group_policies'] = this.buildSnmpGroupPolicies(stateData['snmp']);
    this.state['ntp_policies'] = this.buildNtpPolicies(stateData['ntp']);
    this.state['syslog_policies'] = this.buildSyslogPolicies();
    this.state['vpc_protection_group'] = this.buildVpcProtection(stateData['vpcs']);
    this.state['overlay'] = this.buildBridgeDomains(stateData['global'], stateData['vlans']);
    this.state['oob_mgmt_policies'] = this.buildOobManagement(stateData['oob']);
    this.state['inb_mgmt_policies'] = this.buildIbManagement(stateData['ib']);
    this.state['vlan_pools'] = this.buildVlanPools(stateData['vlans']);
    this.state['physical_domain'] = this.buildPhysDomain(stateData['global']);
    this.state['aaep_policies'] = this.buildAaepPolicies(stateData['global']);

    console.log("STATE:");
    console.log(this.state);

    this.saveState(this.state)
    .subscribe(resp => {
        console.log(resp);
    });
  }

  saveState(state) {
    var token = localStorage.getItem('fabricToken')
    var saveUrl = environment.baseUrl + '/api/fabric/' + token;

    console.log("Saving State...");
    console.log(saveUrl);
    return this.http.patch<any>(saveUrl, state);
  }

  buildBgp(nodes, global) {
    var spines = [];
    var spineNodes = nodes.filter(node => node.role == 'spine');

    console.log("Spine Nodes:");
    console.log(spineNodes);

    spineNodes.forEach(spine => {
      spines.push(spine.name);
    })

    var bgpPolicy = {
      name: 'default',
      bgpAsP: {
        asn: global['bgp_asn']
      },
      bgpRRP: {
        podId: '1',
        bgpRRNodePEp: spines
      }
    };

    return [bgpPolicy];
  }

  buildDns() {
    return [];
  }

  buildCoop(global) {
    var coopEnabled = {
      name: 'default',
      type: 'strict'
    };

    if(global['coop_group']) {
      return [coopEnabled];
    } else {
      return [];
    }
  }

  buildRogue(global) {
    var rogueEnabled = {
      name: 'default',
      adminSt: 'enabled',
      holdIntvl: '1800',
      rogueEpDetectIntvl: '60',
      rogueEpDetectMult: '4'
    };

    if(global['rogue_ep']) {
      return [rogueEnabled];
    } else {
      return [];
    }
  }

  buildIpAging(global) {
    var ipAgingEnabled = {
      name: 'default',
      adminSt: 'enabled'
    }

    if(global['ip_aging']) {
      return [ipAgingEnabled];
    } else {
      return [];
    }
  }

  buildSubnetCheck(global) {
    var subnetCheckEnabled = {
      name: 'default',
      domainValidation: 'yes',
      enforceSubnetCheck: 'yes'
    };

    if(global['subnet_check']) {
      return [subnetCheckEnabled];
    } else {
      return [];
    }
  }

  buildCdpPolicies() {
    var cdpPolicies = [
      {
        name: 'CDP_Enabled',
        adminSt: 'enabled'
      },
      {
        name: 'CDP_Disabled',
        adminSt: 'disabled'
      }
    ];

    return cdpPolicies;
  }

  buildLldpPolicies() {
    var lldpPolicies = [
      {
        name: 'LLDP_Enabled',
        adminRxSt: 'enabled',
        adminTxSt: 'enabled'
      },
      {
        name: 'LLDP_Disabled',
        adminRxSt: 'disabled',
        adminTxSt: 'disabled'
      }
    ];

    return lldpPolicies;
  }

  buildLinkLevelPolicies() {
    var linkLevelPolicies = [
      {name: '1G_Auto', speed: '1G', autoNeg: 'on'},
      {name: '1G_Static', speed: '1G', autoNeg: 'off'},
      {name: '10G_Auto', speed: '10G', autoNeg: 'on'},
      {name: '10G_Static', speed: '10G', autoNeg: 'off'},
      {name: '25G_Auto', speed: '25G', autoNeg: 'on'},
      {name: '25G_Static', speed: '25G', autoNeg: 'off'},
      {name: '40G_Auto', speed: '40G', autoNeg: 'on'},
      {name: '40G_Static', speed: '40G', autoNeg: 'off'},
      {name: '50G_Auto', speed: '50G', autoNeg: 'on'},
      {name: '50G_Static', speed: '50G', autoNeg: 'off'},
      {name: '100G_Auto', speed: '100G', autoNeg: 'on'},
      {name: '100G_Static', speed: '100G', autoNeg: 'off'},
      {name: '200G_Auto', speed: '200G', autoNeg: 'on'},
      {name: '200G_Static', speed: '200G', autoNeg: 'off'},
      {name: '400G_Auto', speed: '400G', autoNeg: 'on'},
      {name: '400G_Static', speed: '400G', autoNeg: 'off'}
    ];

    return linkLevelPolicies;
  }

  buildMcpPolicies() {
    var mcpPolicies= [
      {name: 'MCP_Enabled', adminSt: 'enabled'},
      {name: 'MCP_Disabled', adminSt: 'disabled'}
    ];

    return mcpPolicies;
  }

  buildSnmpPolicies(snmp) {
    var snmpV2Users = snmp['users'].filter(user => user.version == 2);
    var snmpV3Users = snmp['users'].filter(user => user.version == 3);


    var snmpPolicy = {
      name: 'default',
      adminSt: 'enabled',
      contact: snmp['contact'],
      loc: snmp['location'],
      snmpUserP: [],
      snmpTrapFwdServerP: [],
      snmpCommunityP: [],
      snmpClientGrpP: [
        {
          name: 'snmpClientGrpProf',
          snmpClientP: []
        }
      ]
    };

    snmpV3Users.forEach(v3User => {
      var newV3User = {
        name: v3User['name'],
        privType: v3User['privType'],
        privKey: v3User['privKey'],
        authType: v3User['authType'],
        authKey: v3User['authKey']
      };

      snmpPolicy['snmpUserP'].push(newV3User);
    });

    snmp['traps'].forEach(trap => {
      var newTrap = {
        addr: trap['addr'],
        port: trap['port']
      }

      snmpPolicy['snmpTrapFwdServerP'].push(newTrap);
    });

    snmpV2Users.forEach(v2User => {
      var newV2User = {
        name: v2User['name']
      };

      snmpPolicy['snmpCommunityP'].push(newV2User);
    });

    snmp['subnets'].forEach(subnet => {
      var snmpNetAddr = subnet['subnet'] + '/' + subnet['mask'];
      var snmpNetName = snmpNetAddr.replace(/\./g, "-");
      var snmpNetName = snmpNetName.replace(/\//g, "_");

      var newClient = {
        name: snmpNetName,
        addr: snmpNetAddr
      };

      snmpPolicy.snmpClientGrpP[0].snmpClientP.push(newClient);
    });

    return [snmpPolicy];
  }

  buildSnmpGroupPolicies(snmp) {
    return [];
  }

  buildNtpPolicies(ntp) {
    var ntpPolicy =     {
      name: 'default',
      adminSt: 'enabled',
      authSt: 'enabled',
      serverState: 'disabled',
      masterMode: 'disabled',
      datetimeNtpProv: []
    };

    ntp.forEach(ntp => {
      var newNtp = {
        name: ntp['addr'],
        minPoll: '4',
        maxPoll: '6'
      }

      if(ntp['pref']) {
        newNtp['preferred'] = 'yes';
      } else {
        newNtp['preferred'] = 'no';
      }

      ntpPolicy['datetimeNtpProv'].push(newNtp);
    });

    /*
      'datetimeNtpProv': [
        {
          'name': '1.1.1.1',
          'minPoll': '4',
          'maxPoll': '6',
          'preferred': 'yes',
          'key': '23456',
          'keyType': 'sha1',
          'trusted': 'yes'
        },
    */

    return [ntpPolicy];
  }

  buildSyslogPolicies() {
    return [];
  }

  buildVpcProtection(vpc) {
    var newProtGrp =     {
      name: 'default',
      pairT: 'explicit',
      podId: '1',
      vpc_domain_policy: 'default',
      vpc_pairs: {}
    };

    var newVpc = {};

    vpc.forEach(vpc => {
      newVpc[vpc['id']] = [vpc['a'], vpc['b']];
    });

    newProtGrp['vpc_pairs'] = newVpc;

    return [newProtGrp];
  }

  buildBridgeDomains(global, vlan) {
    var newBridgeDom = {};

    newBridgeDom[global['company_name']] = {
      vlans: []
    };

    vlan.forEach(vlan => {
      var vlanSubnet = vlan['svi'] + '/' + vlan['mask'];

      var newVlan = {
        id: vlan['name'],
        subnet: vlanSubnet,
        optimized: false
      };

      newBridgeDom[global['company_name']].vlans.push(newVlan);
    });

    return newBridgeDom;
  }

  buildOobManagement(oob) {
    var newV6gw;
    var newV6addr;

    if(oob['ipv6_gw'] = '') {
      newV6gw = '::';
    } else {
      newV6gw = oob['ipv6_gw'];
    }

    var newOobMgmt = {
      podId: '1',
      gw: oob['ipv4_gw'],
      v6Gw: newV6gw,
      nodes: []
    };

    oob['nodes'].forEach(node => {
      var newV4Addr = node['ipv4Addr'] + '/' +  oob['ipv4_mask'];

      if(node['ipv6Addr'] = '') {
        newV6addr = '::';
      } else {
        newV6addr = node['ipv6Addr'] + '/' + oob['ipv6_mask'];
      }

      var newNode = {
        name: node['id'],
        ipv4: newV4Addr,
        ipv6: newV6addr,
      };

      newOobMgmt['nodes'].push(newNode);
    });

    return newOobMgmt;
  }
  buildIbManagement(ib) {
    var ibMgmtv4Subnet = ib['ipv4_gw'] + '/' + ib['ipv4_mask'];
    var ibMgmtVlan = 'vlan-' + ib['ib_vlan'];

    var newIbMgmt = {
      podId: '1',
      gw: ib['ipv4_gw'],
      subnet: ibMgmtv4Subnet,
      vlan: ibMgmtVlan,
      inb_epg_name: 'inb_mgmt_EPG',
      inb_contract_name: 'inb_mgmt_Contract',
      inb_subject_name: 'inb_mgmt_Subject',
      nodes: []
    };

    ib['nodes'].forEach(node => {
      var newV4Subnet = node['ipv4Addr'] + '/' + ib['ipv4_mask'];
      var newV6Subnet = node['ipv6Addr'] + '/' + ib['ipv6_mask'];

      var newNode = {
        name: node['id'],
        ipv4: newV4Subnet,
        ipv6: newV6Subnet
      };

      newIbMgmt['nodes'].push(newNode);
    });

    return newIbMgmt;
  }

  buildVlanPools(vlans) {
    var vlanPools = [];

    vlans.forEach(vlan => {
      var newVlan = {
        name: vlan['name'],
        start: vlan['id'],
        end: vlan['id'],
        allocMode: 'static',
        role: 'external'
      }

      vlanPools.push(newVlan);
    });

    return vlanPools;
  }

  buildPhysDomain(global) {
    var newPhysDomName = global['company_name'] + '_physDom';

    var newPhysDom = {
      name: newPhysDomName,
      vlan_pool: 'dCloud_VLAN_Pool'
    }

    return [newPhysDom];
  }

  buildAaepPolicies(global) {
    var newPhysDomName = global['company_name'] + '_physDom';
    var newAaepName = global['company_name'] + 'aaep';
    
    var newAaepPolicy =     {
      name: newAaepName,
      domain: newPhysDomName
    };

    return [newAaepPolicy];
  }
}
