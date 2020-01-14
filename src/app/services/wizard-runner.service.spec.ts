import { TestBed } from '@angular/core/testing';

import { WizardRunnerService } from './wizard-runner.service';

describe('WizardRunnerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WizardRunnerService = TestBed.get(WizardRunnerService);
    expect(service).toBeTruthy();
  });
});
