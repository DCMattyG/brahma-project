import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FabricBuilderService {

  constructor(private http: HttpClient) { }

  config = {};

  create(config) {
    this.config = config;

    this.config['vpcs'] = [];
    this.config['vlans'] = [];

    this.loadSwitches();
  }

  loadSwitchBlueprints(switchModel): Observable<any> {
    var switchBlueprint = './assets/switch/' + switchModel + '.json';
    return this.http.get(switchBlueprint);
  }

  loadSwitches() {
    this.config['nodes'].forEach(node => {
      if(node.role == 'leaf') {
        this.loadSwitchBlueprints(node.model)
        .subscribe(data => {
          node.blueprint = data.config;
        });
      }
    });
  }

  getNodes() {
    return this.config['nodes'];
  }

  getNode(nodeID) {
    return this.config['nodes'].filter(node => node.id == nodeID);
  }

  getApics() {
    return this.config['nodes'].filter(node => node.role == 'controller');
  }

  getSpines() {
    return this.config['nodes'].filter(node => node.role == 'spine');
  }

  getLeaves() {
    return this.config['nodes'].filter(node => node.role == 'leaf');
  }

  getSlots(switchID) {
    var targetSwitch = this.config['nodes'].find(node => node.id == switchID);

    return Object.keys(targetSwitch['blueprint']);
  }

  getRows(switchID, switchSlot) {
    var targetSwitch = this.config['nodes'].find(node => node.id == switchID);
    var switchRows = targetSwitch.blueprint[switchSlot];

    return Object.keys(switchRows);
  }

  getRow(switchID, switchSlot, switchRow) {
    var targetSwitch = this.config['nodes'].find(node => node.id == switchID);
    var slotData = targetSwitch.blueprint[switchSlot];
    var rowData = slotData[switchRow];
    
    return rowData;
  }

  createVPC(nodeA, nodeB) {
    var newVPC = {
      id: nodeA,
      a: nodeA,
      b: nodeB
    };

    this.config['vpcs'].push(newVPC)
  }

  getVPC() {
    var vpcNodes = [];

    this.config['vpcs'].forEach(vpc => {
      var nodeA = this.getLeaves().find(leaf => leaf.id == vpc.a);
      var nodeB = this.getLeaves().find(leaf => leaf.id == vpc.b);

      var vpcObject = {
        id: vpc.id,
        a: nodeA,
        b: nodeB
      };

      vpcNodes.push(vpcObject);
    });

    return vpcNodes;
  }

  getNonVPC() {
    var noVPCNodes = this.getLeaves();

    this.config['vpcs'].forEach(vpc => {
      var nodeAIndex = noVPCNodes.findIndex(node => node.id == vpc.a)
      noVPCNodes.splice(nodeAIndex, 1);

      var nodeBIndex = noVPCNodes.findIndex(node => node.id == vpc.b)
      noVPCNodes.splice(nodeBIndex, 1);
    });

    return noVPCNodes;
  }

  deleteVPC(vpcID) {
    var vpcIndex = this.config['vpcs'].indexOf(vpc => vpc.id == vpcID);

    this.config['vpcs'].splice(vpcIndex, 1);
  }
}
