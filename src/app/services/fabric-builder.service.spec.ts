import { TestBed } from '@angular/core/testing';

import { FabricBuilderService } from './fabric-builder.service';

describe('SwitchBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FabricBuilderService = TestBed.get(FabricBuilderService);
    expect(service).toBeTruthy();
  });
});
