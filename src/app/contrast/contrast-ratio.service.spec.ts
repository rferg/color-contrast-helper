import { TestBed } from '@angular/core/testing';

import { ContrastRatioService } from './contrast-ratio.service';

describe('ContrastRatioService', () => {
  let service: ContrastRatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContrastRatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
