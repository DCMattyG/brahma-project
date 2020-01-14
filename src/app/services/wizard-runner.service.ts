import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { Subject } from 'rxjs';

import { WizardOOBMgmtComponent } from '../wizard/steps/oob-mgmt/wizard-oob-mgmt.component';
import { WizardIBMgmtComponent } from '../wizard/steps/ib-mgmt/wizard-ib-mgmt.component';
import { VlanManageComponent } from '../vlans/vlan-manage/vlan-manage.component';
import { WizardNTPConfigComponent } from '../wizard/steps/ntp-config/wizard-ntp-config.component';
import { GlobalConfigComponent } from '../global/global-config.component';

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
      factory: this.resolver.resolveComponentFactory(GlobalConfigComponent),
      required: true
    },
    {
      name: "oobMgmt",
      title: "Out-of-Band Management",
      factory: this.resolver.resolveComponentFactory(WizardOOBMgmtComponent),
      required: false
    },
    {
      name: "ibMgmt",
      title: "In-Band Management",
      factory: this.resolver.resolveComponentFactory(WizardIBMgmtComponent),
      required: false
    },
    {
      name: "ntp",
      title: "NTP Configuration",
      factory: this.resolver.resolveComponentFactory(WizardNTPConfigComponent),
      required: false
    },
    {
      name: "vlan",
      title: "VLAN Management",
      factory: this.resolver.resolveComponentFactory(VlanManageComponent),
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

  getFactory(step) {
    return this.wizSteps[step].factory;
  }
  
  getNumSteps() {
    return (this.wizSteps.length - 1);
  }
}
