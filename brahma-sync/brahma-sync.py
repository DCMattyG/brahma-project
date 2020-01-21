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
bgp_attributes = {
  'bgpInstPol': {
    'name': None,
    'bgpAsP': ['asn'],
    'bgpRRP': ['podId', 'bgpRRNodePEp']
  },
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
      sub_keys = list(policy[parent].keys())
      for c in children:
        if c not in sub_keys:
          print(parent, children, c, sub_keys)
          raise Exception('Missing required {0}'.format(c))
      continue

    # There's further structure down the tree.  Recursively descend
    validate(children, policy[parent])

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

  # Is the ASN correct
  bgpAsP = apic.lookupByClass('bgpAsP')
  parentDNs = [str(b._parentDn()) for b in bgpAsP]
  asnIdx = parentDNs.index(str(mo.dn))

  if bgpAsP[asnIdx].asn != policy['bgpAsP']['asn']:
    mo_changes = create_bgp_policy(mo_changes, policy, nodes)
    return mo_changes

  # Are the route reflector nodes correct
  bgpRRP = apic.lookupByClass('bgpRRP')
  parentDNs = [str(b._parentDn()) for b in bgpRRP]
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

def apply_bgp_policy(apic=None, policies=None):
  """
  policies are the defined state from the SaaS service
  """

  baseDN = 'uni/fabric/bgpInstP-{0}'
  className = 'bgpInstPol'

  mo_changes = None

  # Fetch existing policies from APIC
  existing = apic.lookupByClass(className)
  eDN = [ str(e.dn) for e in existing ]

  # Loop over each policies to be defined
  for p in policies:
    pDN = baseDN.format(p['name'])

    # New policy
    if pDN not in eDN:
      mo_changes = create_bgp_policy(mo_changes, p)
      continue

    # Existing Policy
    i = eDN.index(pDN)

    # Merging reconciliation with created changed mo 
    changes = reconcile_bgp_policy(apic, existing[i], p, mo_changes)
    if changes:
      mo_changes = changes

  return mo_changes

def apply_policy(
  apic=None, policies=None, baseDN=None, 
  className=None, attrs=None, create=None
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

  # SNMP Policies
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['snmp_policies'],
    baseDN='uni/fabric/snmppol-{0}', className='snmpPol',
    attrs=snmp_attributes, create=create_snmp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  # BGP RR Policies (custom method for nested)
  mo_changes = apply_bgp_policy(
    apic=apic1, policies=sample.state['bgp_policies']
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))
    cfgRequest.addMo(mo_changes)

  if cfgRequest.configMos:
    apic1.commit(cfgRequest)
