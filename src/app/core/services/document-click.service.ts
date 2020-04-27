import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';

@Injectable()
export class DocumentClickService {
  click$: Observable<MouseEvent>;

  constructor(@Inject(DOCUMENT) private document: Document) {
    if (this.document) {
      this.click$ = fromEvent(this.document, 'click') as Observable<MouseEvent>;
    }
  }
}
