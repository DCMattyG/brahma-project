import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnmpComponent } from './snmp.component';

describe('SnmpComponent', () => {
  let component: SnmpComponent;
  let fixture: ComponentFixture<SnmpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnmpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnmpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
