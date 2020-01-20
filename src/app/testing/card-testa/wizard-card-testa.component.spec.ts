import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardCardTestAComponent } from './wizard-card-testa.component';

describe('WizardStepSixComponent', () => {
  let component: WizardCardTestAComponent;
  let fixture: ComponentFixture<WizardCardTestAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardCardTestAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardCardTestAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
