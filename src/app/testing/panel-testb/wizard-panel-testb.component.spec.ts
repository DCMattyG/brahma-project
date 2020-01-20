import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPanelTestBComponent } from './wizard-panel-testb.component';

describe('WizardPanelTestBComponent', () => {
  let component: WizardPanelTestBComponent;
  let fixture: ComponentFixture<WizardPanelTestBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPanelTestBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPanelTestBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
