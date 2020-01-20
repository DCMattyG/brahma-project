import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, ComponentFactoryResolver, Input, ComponentFactory } from '@angular/core';
import { WizardRunnerService } from '../../services/wizard-runner.service';
import { OnePanelComponent } from '../../testing/one-panel/one-panel.component';
import { ThreePanelComponent } from '../../testing/three-panel/three-panel.component';
import { FourPanelComponent } from '../../testing/four-panel/four-panel.component';
import { TwoPanelHComponent } from '../../testing/two-panel-h/two-panel-h.component';
import { TwoPanelVComponent } from '../../testing/two-panel-v/two-panel-v.component';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, OnDestroy {
  @ViewChild("dynamicContainer", { read: ViewContainerRef }) container;
  @Input() targetComponent;
  @Input() isWizard;

  constructor(private resolver: ComponentFactoryResolver,
              private wizRun: WizardRunnerService) { }

  componentRef;
  percentComplete;
  modalOpen = false;

  toggleModal() {
    this.modalOpen = this.modalOpen == true ? false : true;
  }

  prevStep() {
    this.targetComponent = this.wizRun.getPrevStep();

    this.refreshComponent();
  }

  nextStep() {
    this.targetComponent = this.wizRun.getNextStep();

    this.refreshComponent();
  }

  refreshComponent() {
    var factory = this.resolver.resolveComponentFactory(this.targetComponent.component);

    this.container.clear(); 
    this.componentRef = this.container.createComponent(factory);
  }

  submitChild() {
    this.componentRef.instance.onSubmit();
  }

  ngOnInit() {
    // this.isWizard = true;

    if(this.isWizard) {
      this.wizRun.percentComplete.subscribe(value => {
        this.percentComplete = value;
      });
  
      this.targetComponent = this.wizRun.getStep();
    } else {
      // this.targetComponent = {
      //   name: 'comptWrap',
      //   title: "Component Wrapper",
      //   help: "Important details about the settings in this wizard step.",
      //   component: FourPanelComponent,
      //   required: false
      // };
    }

    this.refreshComponent();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
