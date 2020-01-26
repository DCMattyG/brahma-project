import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-vpc',
  templateUrl: './vpc.component.html',
  styleUrls: ['./vpc.component.scss']
})
export class VpcComponent implements OnInit {
  vlanForm: FormGroup;

  constructor(public http: HttpClient,
              public formBuilder: FormBuilder,
              public fb: FabricBuilderService) {
    this.vlanForm = this.formBuilder.group({
      vlan: new FormControl(''),
      node: new FormControl(''),
      port: new FormControl('')
    });
  }

  infoModal = false;
  vlanModal = false;
  vlanDrop = false;

  totalActive = 0;
  activeSwitch = {};

  tempLeaves = [];
  tempVPCs = [];
  renderLeaves = {
    id: -1,
    nodes: []
  };

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

  toggleSwitch(leaf) {
    if(leaf.active == false) {
      var activeCount = this.tempLeaves.filter(leaf => leaf.active == true)

      if(activeCount.length <= 1) {
        leaf.active = true;

        if(activeCount.length == 0) {
          this.renderLeaves = {
            id: -1,
            nodes: [leaf]
          };
        } else {
          this.renderLeaves = {
            id: -1,
            nodes: []
          }
        }
      }
    } else {
      leaf.active = false;

      var activeCount = this.tempLeaves.filter(leaf => leaf.active == true)

      if(activeCount.length == 1) {
        this.renderLeaves = {
          id: -1,
          nodes: activeCount
        };
      } else if(activeCount.length == 0) {
        this.renderLeaves = {
          id: -1,
          nodes: []
        };
      }
    }
  }

  toggleVPC(vpc) {
    if(vpc.active == false) {
      var activeCount = this.tempVPCs.filter(vpc => vpc.active == true)

      if(activeCount.length == 0) {
        vpc.active = true;
      } else {
        this.tempVPCs.forEach(vpc => {
          vpc.active = false;
        });

        vpc.active = true;
      }

      this.renderLeaves = {
        id: vpc.id,
        nodes: [vpc.a, vpc.b]
      };
    } else {
      vpc.active = false;

      this.renderLeaves = {
        id: -1,
        nodes: []
      };
    }
  }

  sortDummy() {
    console.log("Dummy sort...");
  }

  sortByName() {
    this.tempLeaves.sort(this.compareName);
  }

  toggleModal() {
    this.infoModal = this.infoModal == true ? false : true;
  }

  onSubmit() {
    console.log(this.vlanForm.value);
  }

  refreshVPC() {
    this.tempVPCs = this.fb.getVPC();
    this.tempLeaves = this.fb.getNonVPC();

    this.tempVPCs.forEach(vpc => {
      vpc.active = false;
    });

    this.tempLeaves.forEach(leaf => {
      leaf.active = false;
    });

    this.tempLeaves.sort(this.compareID);
    this.tempVPCs.sort(this.compareID);
  }

  createVPC() {
    var vpcLeaves = this.tempLeaves.filter(leaf => leaf.active == true)
    var leafCount = vpcLeaves.length;

    if(leafCount == 2) {
      var id = vpcLeaves[0].id;
      var nodeA = vpcLeaves[0].name;
      var nodeB = vpcLeaves[1].name;

      this.tempLeaves.forEach(leaf => {
        leaf.active = false;
      });

      this.fb.createVPC(id, nodeA, nodeB);
      this.refreshVPC();
      
      this.renderLeaves = {
        id: -1,
        nodes: []
      }
    }
  }

  deleteVPC() {
    var activeVPC = this.tempVPCs.filter(vpc => vpc.active == true);
    var activeCount = activeVPC.length;

    if(activeCount == 1) {
      this.fb.deleteVPC(activeVPC['id']);

      this.refreshVPC();
    }

    this.renderLeaves = {
      id: -1,
      nodes: []
    }
  }

  portClick(switchID, intName) {
    console.log("Clicked port " + intName + " on Node " + switchID);
    this.vlanForm.patchValue({  
      port: intName,  
      node: switchID
    });

    this.vlanModal = true;
  }

  toggleVlan() {
    this.vlanDrop = this.vlanDrop == true ? false : true;
  }

  setVlan(vlan) {
    this.vlanForm.patchValue({  
      vlan: vlan
    });

    this.vlanDrop = false;
  }

  cancelVlan() {
    this.vlanForm.reset();
    this.vlanModal = false;
  }

  ngOnInit() {
    this.refreshVPC();
  }
}
