import { Component, OnInit, ViewContainerRef, ViewChild, OnDestroy } from '@angular/core';
import { WizardRunnerService } from '../services/wizard-runner.service';

@Component({
  selector: 'app-wizard-wrapper',
  templateUrl: './wizard-wrapper.component.html',
  styleUrls: ['./wizard-wrapper.component.scss']
})
export class WizardWrapperComponent implements OnInit, OnDestroy {
  @ViewChild("wizardContainer", { read: ViewContainerRef }) container;

  componentRef;
  currentStep;
  percentComplete;

  constructor(private wizRun: WizardRunnerService) { }

  prevStep() {
    this.currentStep = this.wizRun.getPrevStep();

    this.refreshComponent();
  }

  nextStep() {
    this.currentStep = this.wizRun.getNextStep();

    this.refreshComponent();
  }

  refreshComponent() {
    this.container.clear(); 
    this.componentRef = this.container.createComponent(this.currentStep.factory);
  }

  ngOnInit() {
    this.wizRun.percentComplete.subscribe(value => {
      this.percentComplete = value;
    });

    this.currentStep = this.wizRun.getStep();
    this.refreshComponent();
  }

  submitChild() {
    this.componentRef.instance.onSubmit();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
