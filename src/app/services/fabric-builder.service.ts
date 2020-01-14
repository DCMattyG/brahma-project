import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabricBuilderService {

  constructor(private http: HttpClient) { }

  switchData = [];
  
  create(config) {    
    this.switchData = config;

    this.loadSwitches();
  }

  loadSwitchDetails(switchModel): Observable<any> {
    var switchFile = './assets/switch/' + switchModel + '.json';
    return this.http.get(switchFile);
  }

  loadSwitches() {
    var leafFilter = this.switchData.filter(node => node.role == 'leaf');

    leafFilter.forEach(sw => {
      this.loadSwitchDetails(sw.model)
      .subscribe(data => {
        sw.config = data.config;
      });
    });
  }

  getSwitches() {
    return this.switchData;
  }

  getSpinesDetail() {
    var spineSwitches = [];
    var spineFilter = this.switchData.filter(node => node.role == 'spine');

    spineFilter.forEach(spine => {
      spineSwitches.push(spine)
    });

    return spineSwitches;
  }

  getLeavesDetail() {
    var leafSwitches = [];
    var leafFilter = this.switchData.filter(node => node.role == 'leaf');

    leafFilter.forEach(leaf => {
      leafSwitches.push(leaf)
    });

    return leafSwitches;
  }
}
