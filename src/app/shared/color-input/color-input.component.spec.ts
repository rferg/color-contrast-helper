import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ColorInputComponent } from './color-input.component';
import { PopUpStubComponent } from 'src/testing/pop-up-stub-component';
import { DocumentClickService } from 'src/app/core/services/document-click.service';

describe('ColorInputComponent', () => {
  let component: ColorInputComponent;
  let fixture: ComponentFixture<ColorInputComponent>;
  let docClickService: jasmine.SpyObj<DocumentClickService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorInputComponent, PopUpStubComponent ],
      providers: [
        {
          provide: DocumentClickService,
          useValue: jasmine.createSpyObj('DocumentClickService', [], {
            click$: of(new Event('click'))
          })
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorInputComponent);
    component = fixture.componentInstance;
    docClickService = TestBed.inject(DocumentClickService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
