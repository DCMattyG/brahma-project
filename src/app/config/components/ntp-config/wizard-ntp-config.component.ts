import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FabricBuilderService } from 'src/app/services/fabric-builder.service';

@Component({
  selector: 'app-wizard-ntp-config',
  templateUrl: './wizard-ntp-config.component.html',
  styleUrls: ['./wizard-ntp-config.component.scss']
})
export class WizardNTPConfigComponent implements OnInit {
  ntpForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public fb: FabricBuilderService) {
    this.ntpForm = this.formBuilder.group({
      addr: new FormControl(''),
      pref: new FormControl(''),
      epg: new FormControl('')
    });
  }

  // Modal Helpers
  epgMenuOpen = false;
  epgMap = {
    ib: 'In-Band',
    oob: 'Out-of-Band'
  };

  ntpData = [];

  ntpModal = false;
  ntpEdit = null;

  compareName(a, b) {
    const ntpA = a.addr.toUpperCase();
    const ntpB = b.addr.toUpperCase();
  
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
    this.ntpData.sort(this.compareName);
  }

  // Modal Functions

  toggleEPGMenu() {
    this.epgMenuOpen = this.epgMenuOpen == true ? false : true;
  }

  setEPGValue(epgValue) {
    this.ntpForm.patchValue({
      epg: epgValue
    });
  }

  // NTP Functions

  refreshData() {
    this.ntpData = this.fb.getNtp();

    this.ntpData.forEach(ntp => {
      ntp['active'] = false;
    });
  }

  toggleNtp() {
    this.ntpModal = this.ntpModal == true ? false : true;
  }

  resetNtp() {
    this.ntpForm.reset();
  }

  cancelNtp() {
    this.ntpModal = false;
    this.ntpEdit = null;
    this.resetNtp();
  }

  deleteNtp() {
    for(var i = (this.ntpData.length - 1); i >= 0; i--) {
      if (this.ntpData[i].active === true) {
        this.fb.deleteNtp(i);
      }
    }

    this.refreshData();
  }

  editNtp() {
    var activeCount = this.ntpData.filter(ntp => ntp.active == true);

    if(activeCount.length == 1) {
      var activeIndex = this.ntpData.findIndex(ntp => ntp.active == true);
      
      this.ntpForm.patchValue({
        addr: this.ntpData[activeIndex].addr,
        pref: this.ntpData[activeIndex].pref,
        epg: this.ntpData[activeIndex].epg
      });

      this.ntpEdit = activeIndex;
      this.ntpModal = true;
    }
  }

  saveNtp() {
    var newNtp = this.ntpForm.value;

    if(this.ntpEdit != null) {
      this.fb.updateNtp(newNtp, this.ntpEdit);
    } else {
      this.fb.createNtp(newNtp);
    }

    this.ntpModal = false;
    this.ntpEdit = null;

    this.resetNtp();
    this.refreshData();
  }

  onSubmit() {
    console.log(this.ntpForm.value);
  }

  ngOnInit() {
    this.refreshData();
  }
}
