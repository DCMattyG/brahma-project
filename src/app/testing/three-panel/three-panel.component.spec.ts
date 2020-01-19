import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreePanelComponent } from './three-panel.component';

describe('ThreePanelComponent', () => {
  let component: ThreePanelComponent;
  let fixture: ComponentFixture<ThreePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
