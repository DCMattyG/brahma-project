import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardDNSConfigComponent } from './wizard-dns-config.component';

describe('WizardStepFourComponent', () => {
  let component: WizardDNSConfigComponent;
  let fixture: ComponentFixture<WizardDNSConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardDNSConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardDNSConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
