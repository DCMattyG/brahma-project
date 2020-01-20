import { Component, OnInit } from '@angular/core';
import { FourPanelComponent } from 'src/app/testing/four-panel/four-panel.component';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

  constructor() { }

  component = {
    name: 'comptWrap',
    title: "Component Wrapper",
    help: "Important details about the settings in this wizard step.",
    component: FourPanelComponent,
    required: false
  };

  ngOnInit() {

  }
}
