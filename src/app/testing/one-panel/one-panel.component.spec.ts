import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnePanelComponent } from './one-panel.component';

describe('OnePanelComponent', () => {
  let component: OnePanelComponent;
  let fixture: ComponentFixture<OnePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
