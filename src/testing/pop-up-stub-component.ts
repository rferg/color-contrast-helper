import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-pop-up',
    template: ''
})
export class PopUpStubComponent {
    @Input() show$: Observable<boolean>;
}