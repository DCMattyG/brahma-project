import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-vlan-manage',
  templateUrl: './vlan-manage.component.html',
  styleUrls: ['./vlan-manage.component.scss']
})
export class VlanManageComponent implements OnInit {
  vlanForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public fb: FabricBuilderService) {
    this.vlanForm = this.formBuilder.group({
      name: new FormControl(''),
      id: new FormControl(''),
      svi: new FormControl('')
    });
  }

  vlanData = [];

  vlanModal = false;
  vlanEdit = null;

  compareID(a, b) {
    const vlanA = a.id
    const vlanB = b.id
  
    let comparison = 0;

    if (vlanA > vlanB) {
      comparison = 1;
    } else if (vlanA < vlanB) {
      comparison = -1;
    }

    return comparison;
  }

  compareName(a, b) {
    const vlanA = a.name.toUpperCase();
    const vlanB = b.name.toUpperCase();
  
    let comparison = 0;

    if (vlanA > vlanB) {
      comparison = 1;
    } else if (vlanA < vlanB) {
      comparison = -1;
    }

    return comparison;
  }

  toggleActive(vlan) {
    vlan.active = vlan.active == true ? false : true;
  }

  sortByID() {
    this.vlanData.sort(this.compareID);
  }

  sortByName() {
    this.vlanData.sort(this.compareName);
  }

  refreshData() {
    this.vlanData = this.fb.getVlan();
  }

  toggleVlan() {
    this.vlanModal = this.vlanModal == true ? false : true;
  }

  resetVlan() {
    this.vlanForm.reset();
  }

  cancelVlan() {
    this.vlanModal = false;
    this.vlanEdit = null;
    this.resetVlan();
  }

  deleteVlan() {
    for(var i = (this.vlanData.length - 1); i >= 0; i--) {
      if (this.vlanData[i].active === true) {
        this.fb.deleteVlan(i);
      }
    }

    this.refreshData();
  }

  editVlan() {
    var activeCount = this.vlanData.filter(vlan => vlan.active == true);

    if(activeCount.length == 1) {
      var activeIndex = this.vlanData.findIndex(vlan => vlan.active == true);
      
      this.vlanForm.patchValue({
        name: this.vlanData[activeIndex].name,
        id: this.vlanData[activeIndex].id,
        svi: this.vlanData[activeIndex].svi
      });

      this.vlanEdit = activeIndex;
      this.vlanModal = true;
    }
  }

  saveVlan() {
    var newVlan = this.vlanForm.value;

    if(this.vlanEdit != null) {
      this.fb.updateVlan(newVlan, this.vlanEdit);
    } else {
      this.fb.createVlan(newVlan);
    }

    this.vlanModal = false;
    this.vlanEdit = null;

    this.resetVlan();
    this.refreshData()
  }

  ngOnInit() {
    this.refreshData();
  }
}
