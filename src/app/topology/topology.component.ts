import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FabricBuilderService } from '../services/fabric-builder.service';

@Component({
  selector: 'app-topology',
  templateUrl: './topology.component.html',
  styleUrls: ['./topology.component.scss'],
  host: {
    '(window:resize)': 'fixLines()'
  }
})
export class TopologyComponent implements OnInit, AfterViewInit {

  constructor(private fabricBuilder: FabricBuilderService) { }

  spineSwitches = this.fabricBuilder.getSpines();
  leafSwitches = this.fabricBuilder.getLeaves();

  spines = [];
  leaves = [];
  
  initSpines() {
    this.spineSwitches.forEach(spine => {
      this.spines.push(spine.name);
    });
  }

  initLeaves() {
    this.leafSwitches.forEach(leaf => {
      this.leaves.push(leaf.name);
    });
  }

  groupLeaves(groupSize) {
    var size = (groupSize - 1);
    var leafGroups = [];
    var tempGroup = [];

    this.leaves.forEach((leaf, index) => {
      if(index % size == 0 && index > 0) {
        tempGroup.push(leaf);
        leafGroups.push(tempGroup);
        tempGroup = [];
      } else {
        tempGroup.push(leaf);
      }
    });

    if(tempGroup.length > 0) {
      leafGroups.push(tempGroup);
    }

    leafGroups.reverse();

    return leafGroups;
  }

  drawLines() {
    var leaves = this.leaves;

    this.spines.forEach(function(spine) {
      var spineElem = document.getElementById(spine);
      var spineCenterX = spineElem.offsetLeft + spineElem.offsetWidth / 2;
      var spineCenterY = spineElem.offsetTop + spineElem.offsetHeight / 2 + spineElem.offsetHeight / 2 - 54;

      leaves.forEach(function(leaf) {
        var leafElem = document.getElementById(leaf);
        var leafCenterX = leafElem.offsetLeft + leafElem.offsetWidth / 2;
        var leafCenterY = leafElem.offsetTop + leafElem.offsetHeight / 2 - leafElem.offsetHeight / 2 - 54;

        var newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.setAttribute('id', 'line2');
        newLine.setAttribute('x1', String(spineCenterX));
        newLine.setAttribute('y1', String(spineCenterY));
        newLine.setAttribute('x2', String(leafCenterX));
        newLine.setAttribute('y2', String(leafCenterY));
        newLine.setAttribute("stroke", "lightgrey")

        var targetSVG = document.getElementById("svg1");
        targetSVG.append(newLine);
      });
    });
  }

  fixLines() {
    let element = document.getElementById("svg1");

    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }

    this.drawLines();
  }

  ngAfterViewInit() {
    this.drawLines();
  }

  ngOnInit() {
    this.initSpines();
    this.initLeaves();
  }
}
