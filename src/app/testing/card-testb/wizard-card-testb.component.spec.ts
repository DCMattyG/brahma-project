import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardCardTestBComponent } from './wizard-card-testb.component';

describe('WizardCardTestBComponent', () => {
  let component: WizardCardTestBComponent;
  let fixture: ComponentFixture<WizardCardTestBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardCardTestBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardCardTestBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
