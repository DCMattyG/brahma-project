import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentTemplateComponent } from './component-template.component';

describe('ComponentWrapperComponent', () => {
  let component: ComponentTemplateComponent;
  let fixture: ComponentFixture<ComponentTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
