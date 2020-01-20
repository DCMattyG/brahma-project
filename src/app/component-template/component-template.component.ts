import { Component, OnInit, ViewChild, ViewContainerRef, OnDestroy, ComponentFactoryResolver, Input, ComponentFactory } from '@angular/core';
import { OnePanelComponent } from '../testing/one-panel/one-panel.component';
import { ThreePanelComponent } from '../testing/three-panel/three-panel.component';
import { FourPanelComponent } from '../testing/four-panel/four-panel.component';
import { TwoPanelHComponent } from '../testing/two-panel-h/two-panel-h.component';
import { TwoPanelVComponent } from '../testing/two-panel-v/two-panel-v.component';

@Component({
  selector: 'app-component-template',
  templateUrl: './component-template.component.html',
  styleUrls: ['./component-template.component.scss']
})
export class ComponentTemplateComponent implements OnInit, OnDestroy {
  @ViewChild("dynamicContainer", { read: ViewContainerRef }) container;
  @Input() targetComponent;

  componentRef;

  constructor(private resolver: ComponentFactoryResolver) { }

  percentComplete = 50;
  modalOpen = false;

  currentStep = {
    title: "Component Wrapper",
    help: "Important details about the settings in this wizard step."
  };

  toggleModal() {
    this.modalOpen = this.modalOpen == true ? false : true;
  }

  refreshComponent() {
    var factory = this.resolver.resolveComponentFactory(FourPanelComponent);

    this.container.clear(); 
    this.componentRef = this.container.createComponent(factory);
  }

  ngOnInit() {
    this.refreshComponent();
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }
}
