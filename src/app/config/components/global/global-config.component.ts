import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'app-global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.scss']
})
export class GlobalConfigComponent implements OnInit {
  globalForm: FormGroup;

  constructor(private formBuilder: FormBuilder,) {
    this.globalForm = this.formBuilder.group({
      bgp_asn: new FormControl(''),
      subnet_check: new FormControl(true),
      domain_validation: new FormControl(true),
      isis_redist: new FormControl(true),
      ip_aging: new FormControl(true),
      rouge_ep: new FormControl(true),
      coop_group: new FormControl(true)
    });
  }

  onSubmit() {
    console.log(this.globalForm.value);
  }

  ngOnInit() {
  }
}
