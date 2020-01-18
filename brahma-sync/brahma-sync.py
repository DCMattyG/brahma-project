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
from cobra.model import cdp
from cobra.model import lldp

# Connection information
import config
import sample

cdp_attributes = ['name', 'adminSt']
lldp_attributes = ['name', 'adminRxSt', 'adminTxSt']
link_level_attributes = ['name', 'autoNeg', 'speed']

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

  # CDP
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['cdp_policies'],
    baseDN='uni/infra/cdpIfP-{0}', className='cdpIfPol',
    attrs=cdp_attributes, create=create_cdp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))

    cfgRequest = aciRequest.ConfigRequest()
    cfgRequest.addMo(mo_changes)
    apic1.commit(cfgRequest)

  # LLDP
  mo_changes = apply_policy(
    apic=apic1, policies=sample.state['lldp_policies'],
    baseDN='uni/infra/lldpIfP-{0}', className='lldpIfPol',
    attrs=lldp_attributes, create=create_lldp_policy
  )

  if mo_changes is not None:
    print(toXMLStr(mo_changes))

    cfgRequest = aciRequest.ConfigRequest()
    cfgRequest.addMo(mo_changes)
    apic1.commit(cfgRequest)

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

    cfgRequest = aciRequest.ConfigRequest()
    cfgRequest.addMo(mo_changes)
    apic1.commit(cfgRequest)

  
