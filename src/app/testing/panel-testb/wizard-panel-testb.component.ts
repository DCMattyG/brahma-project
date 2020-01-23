import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-wizard-panel-testb',
  templateUrl: './wizard-panel-testb.component.html',
  styleUrls: ['./wizard-panel-testb.component.scss']
})
export class WizardPanelTestBComponent implements OnInit {

  constructor(public http: HttpClient,
    public fb: FabricBuilderService) { }

  modalOpen = false;
  totalActive = 0;
  activeSwitch = {};

  currentStep = {
    title: "VPC Configuration"
  };

  fakeLeaves = this.fb.getLeavesDetail();

  fakeVPCs = [];

  compareName(a, b) {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
  
    let comparison = 0;

    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }

    return comparison;
  }

  compareID(a, b) {
    const idA = a.id;
    const idB = b.id;
  
    let comparison = 0;

    if (idA > idB) {
      comparison = 1;
    } else if (idA < idB) {
      comparison = -1;
    }

    return comparison;
  }

  compareVersion(a, b) {
    const versionA = a.version;
    const versionB = b.version;
  
    let comparison = 0;

    if (versionA > versionB) {
      comparison = 1;
    } else if (versionA < versionB) {
      comparison = -1;
    }

    return comparison;
  }

  compareIP(a, b) {
    const IPA = a['ip'];
    const IPB = b['ip'];

    const num1 = Number(IPA.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
    const num2 = Number(IPB.split(".").map((num) => (`000${num}`).slice(-3)).join(""));

    return (num1 - num2);
  }

  toggleActive(element) {
    element.active = element.active == true ? false : true;
  }

  sortByName() {
    // console.log("Sort by name...");
    this.fakeLeaves.sort(this.compareName);
  }

  toggleModal() {
    this.modalOpen = this.modalOpen == true ? false : true;
  }

  prevStep() {
    console.log("Previous Step...")
  }

  nextStep() {
    console.log("Next Step...")
  }

  submitChild() {
    console.log("Submit Child...")
  }

  createVPC() {
    var vpcLeaves = this.fakeLeaves.filter(leaf => leaf.active == true)
    var leafCount = vpcLeaves.length;
    var newVPC = {};

    console.log("COUNT: " + leafCount);
    console.log(vpcLeaves);

    if(leafCount == 2) {
      newVPC['a'] = vpcLeaves[0];
      newVPC['b'] = vpcLeaves[1];
      newVPC['id'] = vpcLeaves[0].id;

      var indexA = this.fakeLeaves.indexOf(vpcLeaves[0]);
      var indexB = this.fakeLeaves.indexOf(vpcLeaves[1]);

      this.fakeLeaves.splice(indexB, 1);
      this.fakeLeaves.splice(indexA, 1);

      this.fakeVPCs.push(newVPC);
    }
  }

  deleteVPC() {
    var activeVPC = this.fakeVPCs.filter(vpc => vpc.active == true);
    var activeCount = activeVPC.length;

    if(activeCount == 1) {
      var activeIndex = this.fakeVPCs.indexOf(activeVPC);

      this.fakeVPCs.splice(activeIndex, 1);

      this.fakeLeaves.push(activeVPC[0].a);
      this.fakeLeaves.push(activeVPC[0].b);
    }
  }

  ngOnInit() {
    console.log(this.fb.getLeavesDetail());
    this.fakeLeaves.sort(this.compareID);
  }
}
