import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardOOBMgmtComponent } from './wizard-oob-mgmt.component';

describe('WizardStepOneComponent', () => {
  let component: WizardOOBMgmtComponent;
  let fixture: ComponentFixture<WizardOOBMgmtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardOOBMgmtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardOOBMgmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
