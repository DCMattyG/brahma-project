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
  'coop_group_policies': [
    {'name': 'default', 'type': 'strict'},
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
          'key': '12345',
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
  ]
}
