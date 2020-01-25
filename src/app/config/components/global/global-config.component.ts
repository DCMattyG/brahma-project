import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-global-config',
  templateUrl: './global-config.component.html',
  styleUrls: ['./global-config.component.scss']
})
export class GlobalConfigComponent implements OnInit {
  globalForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private fb: FabricBuilderService) {
    this.globalForm = this.formBuilder.group({
      company_name: new FormControl('ExampleCorp'),
      bgp_asn: new FormControl('65001'),
      subnet_check: new FormControl(true),
      domain_validation: new FormControl(true),
      ip_aging: new FormControl(true),
      rouge_ep: new FormControl(true),
      coop_group: new FormControl(true)
    });
  }

  onSubmit() {
    console.log(this.globalForm.value);
    this.fb.updateGlobal(this.globalForm.value);
  }

  ngOnInit() {
    var existingConfig = this.fb.getGlobal();

    if(existingConfig.length != 0) {
      this.globalForm.patchValue(existingConfig);
    }
  }
}
