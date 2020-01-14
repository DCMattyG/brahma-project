import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlanUsageComponent } from './vlan-usage.component';

describe('VlanUsageComponent', () => {
  let component: VlanUsageComponent;
  let fixture: ComponentFixture<VlanUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlanUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
