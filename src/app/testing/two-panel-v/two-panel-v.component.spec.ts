import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoPanelVComponent } from './two-panel-v.component';

describe('TwoPanelVertComponent', () => {
  let component: TwoPanelVComponent;
  let fixture: ComponentFixture<TwoPanelVComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoPanelVComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoPanelVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
