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

  sortByName() {
    // console.log("Sort by name...");
    this.tempLeaves.sort(this.compareName);
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
      var nodeA = vpcLeaves[0].id;
      var nodeB = vpcLeaves[1].id;

      this.tempLeaves.forEach(leaf => {
        leaf.active = false;
      });

      this.fb.createVPC(nodeA, nodeB);
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
  }

  ngOnInit() {
    this.refreshVPC();
  }
}
