import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-wizard-ib-mgmt',
  templateUrl: './wizard-ib-mgmt.component.html',
  styleUrls: ['./wizard-ib-mgmt.component.scss']
})
export class WizardIBMgmtComponent implements OnInit {
  ibMgmtForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private fabricBuilder: FabricBuilderService) {
    this.ibMgmtForm = this.formBuilder.group({
      config: new FormControl(false),
      v6: new FormControl(false),
      nodes: new FormArray([])
    });
  }

  getFormGroup(groupName): FormGroup {
    return this.ibMgmtForm.get(groupName) as FormGroup;
  }

  getFormArray(groupName: FormGroup, arrayName): FormArray {
    return groupName.get(arrayName) as FormArray;
  }

  newMgmtArray(nodeID) {
    var ibNodes = this.getFormArray(this.ibMgmtForm, 'nodes');

    var newArray = this.formBuilder.group({
      id: [nodeID],
      ipv4Addr: [''],
      ipv4Gw: [''],
      ipv6Addr: [''],
      ipv6Gw: ['']
    });

    ibNodes.push(newArray);
  }

  compareID(a, b) {
    const idA = parseInt(a.id, 10)
    const idB = parseInt(b.id, 10)
  
    let comparison = 0;

    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }

    return comparison;
  }

  get formNodes() {
    return <FormArray>this.ibMgmtForm.get('nodes');
  }

  onSubmit() {
    console.log(this.ibMgmtForm.value);
  }

  ngOnInit() {
    var fabricSwitches = this.fabricBuilder.getNodes();

    fabricSwitches.sort(this.compareID).forEach(sw => {
      this.newMgmtArray(sw.name);
    });
  }
}
