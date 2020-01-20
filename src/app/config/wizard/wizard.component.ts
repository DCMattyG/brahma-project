import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss']
})
export class WizardComponent implements OnInit {

  wizardForm: FormGroup;
  wizardStep = 1;

  constructor(private formBuilder: FormBuilder) {
    this.wizardForm = this.formBuilder.group({
      oobMgmt: new FormControl(""),
      ibMgmt: new FormControl(""),
      ntp: new FormControl(""),
      dns: new FormControl("")
    });
  }

  nextStep(event) {
    this.wizardStep++;
    event.target.blur();
  }

  prevStep(event) {
    this.wizardStep--;
    event.target.blur();
  }

  onSubmit() {
    console.log(this.wizardForm.value);
  }

  ngOnInit() {

  }
}
