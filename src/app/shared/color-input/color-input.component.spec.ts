import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ColorInputComponent } from './color-input.component';
import { PopUpStubComponent } from 'src/testing/pop-up-stub-component';
import { DocumentClickService } from 'src/app/core/services/document-click.service';
import { Color } from 'src/app/core/models/color';

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

  describe('#getter:value', () => {
    it('should return the value', () => {
      const color = new Color('#abc123');
      component.value = color;

      expect(component.value).toEqual(color);
    });
  });

  describe('#setter:value', () => {
    it('should set value', () => {
      const color = new Color('#abc123');
      component.value = color;

      expect(component.value).toEqual(color);
    });

    it('should call registered onChange callback if value changed', () => {
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);

      component.value = new Color('#abc123');

      expect(onChangeSpy).toHaveBeenCalled();
    });

    it('should not call registered onChange callback if value is not changed', () => {
      const color = new Color('#abc123');
      component.value = color;
      const onChangeSpy = jasmine.createSpy('onChange');
      component.registerOnChange(onChangeSpy);

      component.value = color;

      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    it('should should emit true to isDarkColorText$ if value changed and color luminance is above threshold',
      (done: DoneFn) => {
        component.darkTextLuminanceThreshold = 0;
        const color = new Color('#abc123');

        component.isDarkColorText$.subscribe(isDarkColorText => {
          expect(isDarkColorText).toBe(true);
          done();
        });

        component.value = color;
    });

    it('should should emit false to isDarkColorText$ if value changed and color luminance is below threshold',
      (done: DoneFn) => {
        component.darkTextLuminanceThreshold = 1;
        const color = new Color('#abc123');

        component.isDarkColorText$.subscribe(isDarkColorText => {
          expect(isDarkColorText).toBe(false);
          done();
        });

        component.value = color;
    });
  });
});
