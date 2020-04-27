import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

import { DocumentClickService } from './document-click.service';

describe('DocumentClickService', () => {
  let service: DocumentClickService;
  let document: jasmine.SpyObj<Document>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: jasmine.createSpyObj('Document', ['addEventListener', 'removeEventListener'])
        },
        DocumentClickService
      ]
    });
    service = TestBed.inject(DocumentClickService);
    document = TestBed.inject(DOCUMENT) as jasmine.SpyObj<Document>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#constructor', () => {
    it('should set documentClick$', () => {
      expect(service.click$).toBeDefined();
    });

    it('should call document.addEventListener is documentClick$ is subscribed to', () => {
      const subscription = service.click$.subscribe(_ => {});

      expect(document.addEventListener).toHaveBeenCalled();

      subscription.unsubscribe();
    });

  });
});
