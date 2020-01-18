#!/usr/bin/env python

state = {
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
}