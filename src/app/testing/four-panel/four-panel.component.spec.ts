import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPanelComponent } from './four-panel.component';

describe('FourPanelComponent', () => {
  let component: FourPanelComponent;
  let fixture: ComponentFixture<FourPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
