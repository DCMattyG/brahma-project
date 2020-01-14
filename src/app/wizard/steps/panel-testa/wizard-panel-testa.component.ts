import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard-panel-testa',
  templateUrl: './wizard-panel-testa.component.html',
  styleUrls: ['./wizard-panel-testa.component.scss']
})
export class WizardPanelTestAComponent implements OnInit {

  constructor() { }

  percentComplete = 50;
  modalOpen = false;

  currentStep = {
    title: "NTP Configuration"
  };

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

  toggleActive(ntp) {
    ntp.active = ntp.active == true ? false : true;
  }

  sortByName() {
    this.fakeNTPs.sort(this.compareName);
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

  ngOnInit() {
  
  }
}
