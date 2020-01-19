import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoPanelHComponent } from './two-panel-h.component';

describe('TwoPanelComponent', () => {
  let component: TwoPanelHComponent;
  let fixture: ComponentFixture<TwoPanelHComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoPanelHComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoPanelHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
