import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-wizard-dns-config',
  templateUrl: './wizard-dns-config.component.html',
  styleUrls: ['./wizard-dns-config.component.scss']
})
export class WizardDNSConfigComponent implements OnInit {
  @Input() group: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}
