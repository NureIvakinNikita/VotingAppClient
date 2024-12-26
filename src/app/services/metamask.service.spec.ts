import { TestBed } from '@angular/core/testing';

import { MetamaskService } from '../services/metamask.service';

describe('MetamaskService', () => {
  let service: MetamaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetamaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
