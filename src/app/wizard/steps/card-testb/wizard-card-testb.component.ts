import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wizard-card-testb',
  templateUrl: './wizard-card-testb.component.html',
  styleUrls: ['./wizard-card-testb.component.scss']
})
export class WizardCardTestBComponent implements OnInit {

  constructor() { }

  fakeNTPs = [
    {
      "name": "ntp3.esl.cisco.com",
      "pref": true,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp1.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp2.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp5.esl.cisco.com",
      "pref": false,
      "epg": "oob",
      "active": false
    },
    {
      "name": "ntp4.esl.cisco.com",
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

  ngOnInit() {

  }
}
