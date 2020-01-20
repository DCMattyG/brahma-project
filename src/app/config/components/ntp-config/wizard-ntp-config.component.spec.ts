import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardNTPConfigComponent } from './wizard-ntp-config.component';

describe('WizardStepFiveComponent', () => {
  let component: WizardNTPConfigComponent;
  let fixture: ComponentFixture<WizardNTPConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardNTPConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardNTPConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
