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

    this.config['global'] = [];
    this.config['ib'] = [];
    this.config['oob'] = [];
    this.config['vpcs'] = [];
    this.config['vlans'] = [];
    this.config['ntp'] = [];
    this.config['snmp'] = {
      contact: null,
      location: null,
      epg: null,
      users: [],
      traps: [],
      subnets: []
    };

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

  // SNMP General

  getSnmp() {
    return this.config['snmp'];
  }

  updateSnmpContact(contactData) {
    this.config['snmp'].contact = contactData;
  }

  updateSnmpLocation(locationData) {
    this.config['snmp'].location = locationData;
  }

  updateSnmpEpg(epgData) {
    this.config['snmp'].epg = epgData;
  }

  // SNMP Users

  createSnmpUser(newUser) {
    this.config['snmp'].users.push(newUser);
  }

  updateSnmpUser(userData, index) {
    this.config['snmp'].users[index] = userData;
  }

  deleteSnmpUser(index) {
    this.config['snmp'].users.splice(index, 1);
  }

  // SNMP Traps

  createSnmpTrap(newTrap) {
    this.config['snmp'].traps.push(newTrap);
  }

  updateSnmpTrap(trapData, index) {
    this.config['snmp'].traps[index] = trapData;
  }

  deleteSnmpTrap(index) {
    this.config['snmp'].traps.splice(index, 1);
  }

  // SNMP Subnets

  createSnmpSubnet(newSubnet) {
    this.config['snmp'].subnets.push(newSubnet);
  }

  updateSnmpSubnet(subnetData, index) {
    this.config['snmp'].subnets[index] = subnetData;
  }

  deleteSnmpSubnet(index) {
    this.config['snmp'].subnets.splice(index, 1);
  }

  // VLAN General

  getVlan() {
    return this.config['vlans'];
  }

  createVlan(newVlan) {
    this.config['vlans'].push(newVlan);
  }

  updateVlan(vlanData, index) {
    this.config['vlans'][index] = vlanData;
  }

  deleteVlan(index) {
    this.config['vlans'].splice(index, 1);
  }

  // NTP General

  getNtp() {
    return this.config['ntp'];
  }

  createNtp(newNtp) {
    this.config['ntp'].push(newNtp);
  }

  updateNtp(ntpData, index) {
    this.config['ntp'][index] = ntpData;
  }

  deleteNtp(index) {
    this.config['ntp'].splice(index, 1);
  }

  // In-Band Management

  getIbMgmt() {
    return this.config['ib'];
  }

  updateIbMgmt(ibData) {
    this.config['ib'] = ibData;
  }

  // Out-of-Band Management

  getOobMgmt() {
    return this.config['oob'];
  }

  updateOobMgmt(oobData) {
    this.config['oob'] = oobData;
  }

  // Global Settings

  getGlobal() {
    return this.config['global'];
  }

  updateGlobal(globalData) {
    this.config['global'] = globalData;
  }
}
