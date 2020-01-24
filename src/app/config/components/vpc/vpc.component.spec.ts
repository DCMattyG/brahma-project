import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpcComponent } from './vpc.component';

describe('VpcComponent', () => {
  let component: VpcComponent;
  let fixture: ComponentFixture<VpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
