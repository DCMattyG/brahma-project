import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard-panel-testc',
  templateUrl: './wizard-panel-testc.component.html',
  styleUrls: ['./wizard-panel-testc.component.scss']
})
export class WizardPanelTestCComponent implements OnInit {

  constructor() { }

  percentComplete = 75;
  modalOpen = false;
  epgMenuOpen = false;
  epgValue = '';

  currentStep = {
    title: "SNMP Configuration"
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

  fakeTraps = [
    {
      ip: "192.168.42.19",
      port: 3000,
      active: false
    },
    {
      ip: "172.24.67.11",
      port: 2956,
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
    const ntpA = a.name.toUpperCase();
    const ntpB = b.name.toUpperCase();
  
    let comparison = 0;

    if (ntpA > ntpB) {
      comparison = 1;
    } else if (ntpA < ntpB) {
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

  deleteTraps() {
    for(var i = (this.fakeTraps.length - 1); i >= 0; i--) {
      if (this.fakeTraps[i].active === true) {
        this.fakeTraps.splice(i, 1);
      }
    }
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

  sortByIP(target) {
    // this.fakeSubnets.sort(this.compareIP);
    target.sort(this.compareIP);
  }

  toggleModal() {
    this.modalOpen = this.modalOpen == true ? false : true;
  }

  toggleEPGMenu() {
    this.epgMenuOpen = this.epgMenuOpen == true ? false : true;
  }

  setEPGValue(value) {
    this.epgValue = value;
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

  ngOnInit() {
  
  }
}
