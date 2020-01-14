import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardWrapperComponent } from './wizard-wrapper.component';

describe('WizardWrapperComponent', () => {
  let component: WizardWrapperComponent;
  let fixture: ComponentFixture<WizardWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardWrapperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
