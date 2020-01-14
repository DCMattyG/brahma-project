import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FabricBuilderService } from '../services/fabric-builder.service';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss']
})
export class SwitchesComponent implements OnInit {

  constructor(public http: HttpClient,
              public fabricBuilder: FabricBuilderService) { }

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
    
  }
}
