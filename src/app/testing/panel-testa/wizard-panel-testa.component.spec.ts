import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardPanelTestAComponent } from './wizard-panel-testa.component';

describe('WizardPanelTestAComponent', () => {
  let component: WizardPanelTestAComponent;
  let fixture: ComponentFixture<WizardPanelTestAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WizardPanelTestAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WizardPanelTestAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
