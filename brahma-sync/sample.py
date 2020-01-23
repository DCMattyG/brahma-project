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
    },
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
  ]
}
