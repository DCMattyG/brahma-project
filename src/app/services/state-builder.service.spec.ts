import { TestBed } from '@angular/core/testing';

import { StateBuilderService } from './state-builder.service';

describe('StateBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateBuilderService = TestBed.get(StateBuilderService);
    expect(service).toBeTruthy();
  });
});
