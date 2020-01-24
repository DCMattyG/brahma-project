#!/usr/bin/env python

state = {
  'bgp_policies': [
    {
      'name': 'default',
      'bgpAsP': {
        'asn': '65001'
      },
      'bgpRRP': {
        'podId': '1',
        'bgpRRNodePEp': ['Spine1', 'Spine2']
      },
    },
  ],
  'dns_policies': [
    {
      'name': 'default',
      'epgDn': 'uni/tn-mgmt/mgmtp-default/oob-default',
      'dnsProv': [
        {
          'addr': '1.1.1.1',
          'preferred': 'yes'
        },
        {
          'addr': '8.8.8.8',
          'preferred': 'no'
        }
      ],
      'dnsDomain': [
        {
          'name': 'cisco.com',
          'isDefault': 'yes'
        }
      ]
    }
  ],
  'coop_group_policies': [
    {'name': 'default', 'type': 'strict'},
  ],
  'rogue_endpoint_policies': [
    {
      'name': 'default', 'adminSt': 'enabled',
      'holdIntvl': '1800',
      'rogueEpDetectIntvl': '60', 'rogueEpDetectMult': '4'
    }
  ],
  'ip_aging_policies': [
    {'name': 'default', 'adminSt': 'enabled'}
  ],
  'fabric_wide_policies': [
    {
      'name': 'default',
      'domainValidation': 'yes',
      'enforceSubnetCheck': 'yes',
    }
  ],
  'cdp_policies': [
    {'name': 'CDP_Enabled', 'adminSt': 'enabled'},
    {'name': 'CDP_Disabled', 'adminSt': 'disabled'},
  ],
  'lldp_policies': [
    {'name': 'LLDP_Enabled', 'adminRxSt': 'enabled', 'adminTxSt': 'enabled'},
    {'name': 'LLDP_Disabled', 'adminRxSt': 'disabled', 'adminTxSt': 'disabled'},
  ],
  'link_level_policies': [
    {'name': '1G_Auto', 'speed': '1G', 'autoNeg': 'on'},
    {'name': '1G_Static', 'speed': '1G', 'autoNeg': 'off'},
    {'name': '10G_Auto', 'speed': '10G', 'autoNeg': 'on'},
    {'name': '10G_Static', 'speed': '10G', 'autoNeg': 'off'},
    {'name': '25G_Auto', 'speed': '25G', 'autoNeg': 'on'},
    {'name': '25G_Static', 'speed': '25G', 'autoNeg': 'off'},
    {'name': '40G_Auto', 'speed': '40G', 'autoNeg': 'on'},
    {'name': '40G_Static', 'speed': '40G', 'autoNeg': 'off'},
    {'name': '50G_Auto', 'speed': '50G', 'autoNeg': 'on'},
    {'name': '50G_Static', 'speed': '50G', 'autoNeg': 'off'},
    {'name': '100G_Auto', 'speed': '100G', 'autoNeg': 'on'},
    {'name': '100G_Static', 'speed': '100G', 'autoNeg': 'off'},
    {'name': '200G_Auto', 'speed': '200G', 'autoNeg': 'on'},
    {'name': '200G_Static', 'speed': '200G', 'autoNeg': 'off'},
    {'name': '400G_Auto', 'speed': '400G', 'autoNeg': 'on'},
    {'name': '400G_Static', 'speed': '400G', 'autoNeg': 'off'}
  ],
  'mcp_policies': [
    {'name': 'MCP_Enabled', 'adminSt': 'enabled'},
    {'name': 'MCP_Disabled', 'adminSt': 'disabled'},
  ],
  'snmp_policies': [
    {
      'name': 'default', 
      'adminSt': 'enabled', 
      'contact': 'Close Encounter',
      'loc': 'Third Kind',
      'snmpUserP': [
        {
          'name': 'user1',
          'privType': 'aes-128',
          'authType': 'hmac-sha1-96',
          'authKey': 'abcde12345'
        },
        {
          'name': 'user2',
          'privType': 'des',
          'authType': 'hmac-md5-96',
          'authKey': 'fghij67890'
        }
      ],
      'snmpTrapFwdServerP': [
        {
        'addr': '2.3.4.5',
        'port': '162'
        }
      ],
      'snmpCommunityP': [
        {
          'name': 'communityKey1'
        }
      ],
      'snmpClientGrpP': [
        {
          'name': 'snmpClientGrpProf',
          'snmpClientP': [
            {'name': 'snmpClntGrpProfName', 'addr': '1.2.3.4'}
          ]
        }
      ]
    },
  ],
  'snmp_group_policies': [
    {
      'name': 'snmpMonDestGroup',
      'snmpTrapDest': [
        {
          'host': '6.6.3.3',
          'notifT': 'traps',
          'port': '162',
          'secName': 'v3-auth-priv',
          'v3SecLvl': 'priv',
          'ver': 'v3'
        },
        {
          'host': '6.6.3.2',
          'notifT': 'traps',
          'port': '162',
          'secName': 'v3-no-no',
          'v3SecLvl': 'noauth',
          'ver': 'v3'
        },
        {
          'host': '6.6.3.1',
          'notifT': 'traps',
          'port': '162',
          'secName': 'v3-auth-nopriv',
          'v3SecLvl': 'auth',
          'ver': 'v3'
        },
        {
          'host': '6.6.6.6',
          'notifT': 'traps',
          'port': '162',
          'secName': 'v2c-Community',
          'v3SecLvl': 'noauth',
          'ver': 'v2c'
        },
      ]
    }
  ],
  'ntp_policies': [
    {
      'name': 'default',
      'adminSt': 'enabled',
      'authSt': 'enabled',
      'serverState': 'disabled',
      'masterMode': 'disabled',
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
        {
          'name': '2.2.2.2',
          'minPoll': '4',
          'maxPoll': '6',
          'preferred': 'no',
          'key': '12345',
          'keyType': 'md5',
          'trusted': 'no'
        },
      ]
    }
  ],
  'syslog_policies': [
    {
      'name': 'remoteSyslog',
      'format': 'aci',
      'includeMilliSeconds': 'no',
      'syslogRemoteDest': [
        {
          'name': 'syslog_server1',
          'host': '4.1.1.1',
          'port': '514',
          'adminState': 'enabled',
          'format': 'aci',
          'severity': 'warnings',
          'forwardingFacility': 'local7'
        }
      ],
      'syslogProf': {
        'name': 'syslog',
        'adminState': 'enabled',
      },
      'syslogFile': {
        'adminState': 'enabled',
        'format': 'aci',
        'severity': 'information',
      },
      'syslogConsole': {
        'adminState': 'enabled',
        'format': 'aci',
        'severity': 'alerts',
      }
    }
  ],
  'vpc_protection_group': [
    {
      'name': 'default',
      'pairT': 'explicit',
      'podId': '1',
      'vpc_domain_policy': 'default',
      'vpc_pairs': {
        '101': ['Leaf1', 'Leaf2']
      }
    }
  ],
  'overlay': {
    'customer_name': {
      'vlans': [
        { 'id': '101', 'prefix': '192.168.1.0/24', 'gateway': '192.168.1.1' },
        { 'id': '102', 'prefix': '192.168.2.0/24', 'gateway': '192.168.2.1' },
        { 'id': '103', 'prefix': '192.168.3.0/24', 'gateway': '192.168.3.1' },
        { 'id': '104', 'prefix': '192.168.4.0/24', 'gateway': '192.168.4.1' },
      ],
    },
  },
  'oob_mgmt_policies': {
    'podId': '1',
    'gw': '172.16.0.1',
    'v6Gw': '::',
    'nodes': [
      {
        'name': 'Leaf1',
        'ipv4': '172.16.0.21/24',
        'ipv6': '::',
      },
      {
        'name': 'Leaf2',
        'ipv4': '172.16.0.22/24',
        'ipv6': '::',
      },
      {
        'name': 'Spine1',
        'ipv4': '172.16.0.11/24',
        'ipv6': '::',
      },
      {
        'name': 'Spine2',
        'ipv4': '172.16.0.12/24',
        'ipv6': '::',
      },
    ]
  },
  # Note: ipv6 stubbed out but no support in sync today
  'inb_mgmt_policies': {
    'podId': '1',
    'gw': '172.17.0.1',
    'subnet': '172.17.0.1/24',
    'vlan': 'vlan-1000',
    'inb_epg_name': 'inb_mgmt_EPG',
    'inb_contract_name': 'inb_mgmt_Contract',
    'inb_subject_name': 'inb_mgmt_Subject',
    'nodes': [
      {
        'name': 'Leaf1',
        'ipv4': '172.17.0.21/24',
        'ipv6': '::',
      },
      {
        'name': 'Leaf2',
        'ipv4': '172.17.0.22/24',
        'ipv6': '::',
      },
      {
        'name': 'Spine1',
        'ipv4': '172.17.0.11/24',
        'ipv6': '::',
      },
      {
        'name': 'Spine2',
        'ipv4': '172.17.0.12/24',
        'ipv6': '::',
      },
      {
        'name': 'apic1',
        'ipv4': '172.17.0.9/24',
        'ipv6': '::',
      },
      {
        'name': 'apic2',
        'ipv4': '172.17.0.8/24',
        'ipv6': '::',
      },
      {
        'name': 'apic3',
        'ipv4': '172.17.0.7/24',
        'ipv6': '::',
      },
    ]
  },
  'vlan_pools': [
    {
      'name': 'dCloud_VLAN_Pool',
      'start': '1001',
      'end': '1500',
      'allocMode': 'dynamic',
      'role': 'external'
    },
  ],
  'physical_domain': [
    {
      'name': 'customer_name_physDom',
      'vlan_pool': 'dCloud_VLAN_Pool'
    }
  ],
  'aaep_policies': [
    {
      'name': 'customer_name_aaep',
      'domain': 'customer_name_physDom'
    }
  ]
}
