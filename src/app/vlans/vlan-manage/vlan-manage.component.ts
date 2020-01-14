import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-vlan-manage',
  templateUrl: './vlan-manage.component.html',
  styleUrls: ['./vlan-manage.component.scss']
})
export class VlanManageComponent implements OnInit {

  constructor() { }

  fakeVlans = [
    {
      "name": "production",
      "id": 109,
      "svi": "10.10.9.1",
      "active": false
    },
    {
      "name": "development",
      "id": 204,
      "svi": "10.20.4.1",
      "active": false
    },
    {
      "name": "vmware",
      "id": 17,
      "svi": "10.1.7.1",
      "active": false
    },
    {
      "name": "marketing",
      "id": 400,
      "svi": "10.40.0.1",
      "active": false
    },
    {
      "name": "hyper-v",
      "id": 299,
      "svi": "10.29.9.1",
      "active": false
    },
    {
      "name": "test",
      "id": 249,
      "svi": "10.24.9.1",
      "active": false
    },
    {
      "name": "cmdb",
      "id": 867,
      "svi": "10.86.7.1",
      "active": false
    },
    {
      "name": "oob",
      "id": 1,
      "svi": "10.0.1.1",
      "active": false
    },
    {
      "name": "sql",
      "id": 344,
      "svi": "10.3.44.1",
      "active": false
    },
    {
      "name": "oracle",
      "id": 912,
      "svi": "10.91.2.1",
      "active": false
    },
    {
      "name": "citrix",
      "id": 111,
      "svi": "10.11.1.1",
      "active": false
    },
    {
      "name": "horizon",
      "id": 1033,
      "svi": "10.10.33.1",
      "active": false
    },
    {
      "name": "web",
      "id": 80,
      "svi": "10.0.80.1",
      "active": false
    },
    {
      "name": "sap",
      "id": 599,
      "svi": "10.5.99.1",
      "active": false
    },
    {
      "name": "manufacturing",
      "id": 222,
      "svi": "10.22.2.1",
      "active": false
    },
    {
      "name": "reception",
      "id": 1910,
      "svi": "10.19.10.1",
      "active": false
    },
    {
      "name": "facilities",
      "id": 707,
      "svi": "10.70.7.1",
      "active": false
    },
    {
      "name": "security",
      "id": 911,
      "svi": "10.9.11.1",
      "active": false
    },
    {
      "name": "telecom",
      "id": 487,
      "svi": "10.48.7.1",
      "active": false
    },
    {
      "name": "ucsd",
      "id": 668,
      "svi": "10.66.8.1",
      "active": false
    }
  ];

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
    this.fakeVlans.sort(this.compareID);
  }

  sortByName() {
    this.fakeVlans.sort(this.compareName);
  }

  ngOnInit() {
  }

}
