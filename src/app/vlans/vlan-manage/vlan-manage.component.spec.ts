import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VlanManageComponent } from './vlan-manage.component';

describe('VlanManageComponent', () => {
  let component: VlanManageComponent;
  let fixture: ComponentFixture<VlanManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VlanManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VlanManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
