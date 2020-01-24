import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs';

import { WizardOOBMgmtComponent } from '../config/components/oob-mgmt/wizard-oob-mgmt.component';
import { WizardIBMgmtComponent } from '../config/components/ib-mgmt/wizard-ib-mgmt.component';
import { VlanManageComponent } from '../config/components/vlans/vlan-manage/vlan-manage.component';
import { WizardNTPConfigComponent } from '../config/components/ntp-config/wizard-ntp-config.component';
import { GlobalConfigComponent } from '../config/components/global/global-config.component';
import { SnmpComponent } from '../config/components/snmp/snmp.component';
import { VpcComponent } from '../config/components/vpc/vpc.component';

@Injectable({
  providedIn: 'root'
})
export class WizardRunnerService {
  currentStep = 0;
  percentComplete = new Subject<number>();

  wizSteps = [
    {
      name: "globalCfg",
      title: "Global Configuration",
      help: "Important details about the settings in the Global Config wizard step.",
      component: GlobalConfigComponent,
      required: true
    },
    {
      name: "oobMgmt",
      title: "Out-of-Band Management",
      help: "Important details about the settings in the Out-of-Band Management wizard step.",
      component: WizardOOBMgmtComponent,
      required: false
    },
    {
      name: "ibMgmt",
      title: "In-Band Management",
      help: "Important details about the settings in the In-Band Management wizard step.",
      component: WizardIBMgmtComponent,
      required: false
    },
    {
      name: "ntp",
      title: "NTP Configuration",
      help: "Important details about the settings in the NTP wizard step.",
      component: WizardNTPConfigComponent,
      required: false
    },
    {
      name: "vlan",
      title: "VLAN Management",
      help: "Important details about the settings in VLAN Management wizard step.",
      component: VlanManageComponent,
      required: false
    },
    {
      name: "snmp",
      title: "SNMP Configuration",
      help: "Important details about the settings in SNMP Configuration wizard step.",
      component: SnmpComponent,
      required: false
    },
    {
      name: "vpc",
      title: "VPC Configuration",
      help: "Important details about the settings in VPC Configuration wizard step.",
      component: VpcComponent,
      required: false
    }
  ];

  constructor(private resolver: ComponentFactoryResolver) { }

  getPrevStep() {
    this.currentStep--;

    var step = this.wizSteps[this.currentStep];
    step["step"] = this.currentStep;

    this.setPercentComplete(this.currentStep);

    return step;
  }

  getNextStep() {
    this.currentStep++;

    var step = this.wizSteps[this.currentStep];
    step["step"] = this.currentStep;

    this.setPercentComplete(this.currentStep);

    return step;
  }

  getStep() {
    var step = this.wizSteps[this.currentStep];
    step["step"] = this.currentStep;

    this.setPercentComplete(this.currentStep);

    return step;
  }

  getControls() {
    var wizControls = [];

    this.wizSteps.forEach(step => {
      wizControls.push(step.name);
    });

    return wizControls;
  }

  setPercentComplete(stepNum) {
    var percentComplete = (stepNum / this.getNumSteps()) * 100;

    if(percentComplete < 0) {
      percentComplete = 0;
    } else if(percentComplete > 100) {
      percentComplete = 100;
    }

    this.percentComplete.next(Math.round(percentComplete));
  }

  getComponent(step) {
    return this.wizSteps[step].component;
  }
  
  getNumSteps() {
    return (this.wizSteps.length - 1);
  }
}
