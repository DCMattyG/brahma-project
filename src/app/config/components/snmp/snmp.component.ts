import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-snmp',
  templateUrl: './snmp.component.html',
  styleUrls: ['./snmp.component.scss']
})
export class SnmpComponent implements OnInit {
  generalForm: FormGroup;
  snmpForm: FormGroup;
  trapForm: FormGroup;
  subnetForm: FormGroup;

  // General
  epgMenuOpen = false;
  epgMap = {
    ib: 'In-Band',
    oob: 'Out-of-Band'
  };

  // SNMP Users
  userModal = false;
  userEdit = null;

  // SNMP Traps
  trapModal = false;
  trapEdit = null;

  // SNMP Subnets
  subnetModal = false;
  subnetEdit = null;

  constructor(public formBuilder: FormBuilder,
              public fb: FabricBuilderService) {
    this.generalForm = this.formBuilder.group({
      contact: new FormControl(''),
      location: new FormControl(''),
      epg: new FormControl('')
    });

    this.snmpForm = this.formBuilder.group({
      v3: new FormControl(false),
      name: new FormControl(''),
      privType: new FormControl('none'),
      privKey: new FormControl(''),
      authType: new FormControl('md5'),
      authKey: new FormControl('')
    });

    this.trapForm = this.formBuilder.group({
      addr: new FormControl(''),
      port: new FormControl('')
    });

    this.subnetForm = this.formBuilder.group({
      subnet: new FormControl(''),
      mask: new FormControl('')
    });
  }

  snmpData = {
    contact: '',
    location: '',
    epg: '',
    users: [],
    traps: [],
    subnets: []
  };

  // Sort Value Comparison Functions

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
    const IPA = a['addr'];
    const IPB = b['addr'];

    const num1 = Number(IPA.split(".").map((num) => (`000${num}`).slice(-3)).join(""));
    const num2 = Number(IPB.split(".").map((num) => (`000${num}`).slice(-3)).join(""));

    return (num1 - num2);
  }

  // Table Sort Functions

  sortByUser() {
    this.snmpData.users.sort(this.compareName);
  }

  sortByVersion() {
    this.snmpData.users.sort(this.compareVersion);
  }

  sortByIP(target) {
    target.sort(this.compareIP);
  }

  toggleActive(element) {
    element.active = element.active == true ? false : true;
  }

  // SNMP General Functions

  toggleEPGMenu() {
    this.epgMenuOpen = this.epgMenuOpen == true ? false : true;
  }

  setEPGValue(epgValue) {
    this.generalForm.patchValue({
      epg: epgValue
    });
  }

  onSubmit() {
    var generalData = this.generalForm.value;

    this.fb.updateSnmpContact(generalData['contact']);
    this.fb.updateSnmpLocation(generalData['location']);
    this.fb.updateSnmpEpg(generalData['epg']);

    this.refreshData();
  }

  // SNMP Users Functions

  refreshData() {
    this.snmpData = this.fb.getSnmp();

    this.snmpData['users'].forEach(user => {
      user['active'] = false;
    });

    this.snmpData['traps'].forEach(trap => {
      trap['active'] = false;
    });

    this.snmpData['subnets'].forEach(subnet => {
      subnet['active'] = false;
    });

    this.generalForm.patchValue({
      contact: this.snmpData['contact'],
      location: this.snmpData['location'],
      epg: this.snmpData['epg']
    });
  }

  toggleUser() {
    this.userModal = this.userModal == true ? false : true;
  }

  resetUser() {
    this.snmpForm.reset({
      v3: false,
      privType: 'none',
      authType: 'md5'
    });
  }

  cancelUser() {
    this.userModal = false;
    this.userEdit = null;
    this.resetUser();
  }

  setPrivacy(type) {
    this.snmpForm.patchValue({  
      privType: type
    });
  }

  setAuth(type) {
    this.snmpForm.patchValue({  
      authType: type
    });
  }

  deleteUser() {
    for(var i = (this.snmpData.users.length - 1); i >= 0; i--) {
      if (this.snmpData.users[i].active === true) {
        this.fb.deleteSnmpUser(i);
      }
    }

    this.refreshData();
  }

  editUser() {
    var activeCount = this.snmpData.users.filter(snmp => snmp.active == true);

    if(activeCount.length == 1) {
      var activeIndex = this.snmpData.users.findIndex(snmp => snmp.active == true);
      
      this.snmpForm.patchValue({
        name: this.snmpData.users[activeIndex].name,
        privType: this.snmpData.users[activeIndex].privType,
        privKey: this.snmpData.users[activeIndex].privKey,
        authType: this.snmpData.users[activeIndex].authType,
        authKey: this.snmpData.users[activeIndex].authKey,
      });

      if(this.snmpData.users[activeIndex].version == 3) {
        this.snmpForm.patchValue({
          v3: true
        });
      } else {
        this.snmpForm.patchValue({
          v3: false
        });
      }

      this.userEdit = activeIndex;
      this.userModal = true;
    }
  }

  saveUser() {
    var newUser = this.snmpForm.value;

    if(newUser.v3 == false) {
      newUser['version'] = 2;
    } else {
      newUser['version'] = 3;
    }

    delete newUser.v3;

    newUser['active'] = false;

    if(this.userEdit != null) {
      this.fb.updateSnmpUser(newUser, this.userEdit);
    } else {
      this.fb.createSnmpUser(newUser);
    }

    console.log(this.snmpData);

    this.userModal = false;
    this.userEdit = null;
    this.resetUser();
    this.refreshData();
  }

  // SNMP Trap Functions

  toggleTrap() {
    this.trapModal = this.trapModal == true ? false : true;
  }

  resetTrap() {
    this.trapForm.reset();
  }

  cancelTrap() {
    this.trapModal = false;
    this.trapEdit = null;
    this.resetTrap();
  }

  deleteTrap() {
    for(var i = (this.snmpData.traps.length - 1); i >= 0; i--) {
      if (this.snmpData.traps[i].active === true) {
        this.fb.deleteSnmpTrap(i);
      }
    }

    this.refreshData();
  }

  editTrap() {
    var activeCount = this.snmpData.traps.filter(trap => trap.active == true);

    if(activeCount.length == 1) {
      var activeIndex = this.snmpData.traps.findIndex(trap => trap.active == true);
      
      this.trapForm.patchValue({
        addr: this.snmpData.traps[activeIndex].addr,
        port: this.snmpData.traps[activeIndex].port
      });

      this.trapEdit = activeIndex;
      this.trapModal = true;
    }
  }

  saveTrap() {
    var newTrap = this.trapForm.value;

    if(this.trapEdit != null) {
      this.fb.updateSnmpTrap(newTrap, this.trapEdit);
    } else {
      this.fb.createSnmpTrap(newTrap);
    }

    this.trapModal = false;
    this.trapEdit = null;

    this.resetTrap();
    this.refreshData()
  }

  // SNMP Subnet Functions

  toggleSubnet() {
    this.subnetModal = this.subnetModal == true ? false : true;
  }

  resetSubnet() {
    this.subnetForm.reset();
  }

  cancelSubnet() {
    this.subnetModal = false;
    this.subnetEdit = null;
    this.resetSubnet();
  }

  deleteSubnet() {
    for(var i = (this.snmpData.subnets.length - 1); i >= 0; i--) {
      if (this.snmpData.subnets[i].active === true) {
        this.fb.deleteSnmpSubnet(i);
      }
    }

    this.refreshData();
  }

  editSubnet() {
    var activeCount = this.snmpData.subnets.filter(subnet => subnet.active == true);

    if(activeCount.length == 1) {
      var activeIndex = this.snmpData.subnets.findIndex(subnet => subnet.active == true);
      
      this.subnetForm.patchValue({
        subnet: this.snmpData.subnets[activeIndex].subnet,
        mask: this.snmpData.subnets[activeIndex].mask
      });

      this.subnetEdit = activeIndex;
      this.subnetModal = true;
    }
  }

  saveSubnet() {
    var newSubnet = this.subnetForm.value;

    if(this.subnetEdit != null) {
      this.fb.updateSnmpSubnet(newSubnet, this.subnetEdit);
    } else {
      this.fb.createSnmpSubnet(newSubnet);
    }

    this.subnetModal = false;
    this.subnetEdit = null;

    this.resetSubnet();
    this.refreshData();
  }
  
  // Init

  ngOnInit() {
    this.refreshData();
  }
}
