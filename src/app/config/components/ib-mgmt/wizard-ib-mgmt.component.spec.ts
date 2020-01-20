import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardIBMgmtComponent } from './wizard-ib-mgmt.component';

describe('WizardStepTwoComponent', () => {
  let component: WizardIBMgmtComponent;
  let fixture: ComponentFixture<WizardIBMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardIBMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardIBMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
