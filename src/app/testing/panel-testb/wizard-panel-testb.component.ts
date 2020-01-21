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
    public fabricBuilder: FabricBuilderService) { }

  percentComplete = 50;
  modalOpen = false;

  currentStep = {
    title: "VPC Configuration"
  };

  fakeSNMPs = {
    users: [
      {
        name: "snmpV3User1",
        version: 3,
        active: false
      },
      {
        name: "snmpV3User3",
        version: 3,
        active: false
      },
      {
        name: "snmpV3User2",
        version: 3,
        active: false
      },
      {
        name: "snmpV2User1",
        version: 2,
        active: false
      },
      {
        name: "snmpV2User3",
        version: 2,
        active: false
      },
      {
        name: "snmpV2User2",
        version: 2,
        active: false
      }
    ]
  };

  fakeSubnets = [
    {
      ip: "192.168.0.0",
      mask: 24,
      active: false
    },
    {
      ip: "10.10.0.0",
      mask: 16,
      active: false
    },
    {
      ip: "172.24.0.0",
      mask: 24,
      active: false
    }
  ];

  fakeNTPs = [
    {
      "name": "ntp03.esl.cisco.com",
      "pref": true,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp01.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp02.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp11.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp04.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp10.esl.cisco.com",
      "pref": true,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp09.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp13.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp08.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp07.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp05.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp06.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp12.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    }
  ];

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

  toggleActive(ntp) {
    ntp.active = ntp.active == true ? false : true;
  }

  sortByName() {
    this.fakeNTPs.sort(this.compareName);
  }

  sortByUser() {
    this.fakeSNMPs.users.sort(this.compareName);
  }

  sortByVersion() {
    this.fakeSNMPs.users.sort(this.compareVersion);
  }

  sortByIP() {
    this.fakeSubnets.sort(this.compareIP);
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

  getSlots(switchData) {
    return Object.keys(switchData);
  }
  
  getRows(switchData, switchSlot) {
    var switchRows = switchData[switchSlot]
    return Object.keys(switchRows);
  }
  
  getRow(switchData, switchSlot, switchRow) {
    var slotData = switchData[switchSlot];
    var rowData = slotData[switchRow];
    return rowData;
  }

  ngOnInit() {
    console.log(this.fabricBuilder.getLeavesDetail());
  }
}
