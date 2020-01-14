import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalConfigComponent } from './global-config.component';

describe('GlobalConfigComponent', () => {
  let component: GlobalConfigComponent;
  let fixture: ComponentFixture<GlobalConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlobalConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlobalConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
