import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Subject, Subscription } from 'rxjs';

import { ColorInputComponent } from './color-input.component';
import { PopUpStubComponent } from 'src/testing/pop-up-stub-component';
import { DocumentClickService } from 'src/app/core/services/document-click.service';
import { Color } from 'src/app/core/models/color';
import { nameof } from 'src/app/core/models/nameof';
import { FormsModule } from '@angular/forms';

describe('ColorInputComponent', () => {
  let component: ColorInputComponent;
  let fixture: ComponentFixture<ColorInputComponent>;
  let docClickService: jasmine.SpyObj<DocumentClickService>;
  const clickSource = new Subject<MouseEvent>();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ ColorInputComponent, PopUpStubComponent ],
      providers: [
        {
          provide: DocumentClickService,
          useValue: jasmine.createSpyObj('DocumentClickService', [], {
            click$: clickSource.asObservable()
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#constructor', () => {
    it(`should set default ${nameof<ColorInputComponent>('darkTextLuminanceThreshold')}`, () => {
      expect(component.darkTextLuminanceThreshold).toBe(1 / 3);
    });

    it(`should define ${nameof<ColorInputComponent>('isDisabled$')}, ` +
      `${nameof<ColorInputComponent>('isEditing$')}, and ` +
      `${nameof<ColorInputComponent>('isDarkColorText$')} observables`,
      () => {
        expect(component.isDisabled$).toBeDefined('isDisabled$ not defined');
        expect(component.isEditing$).toBeDefined('isEditing$ not defined');
        expect(component.isDarkColorText$).toBeDefined('isDarkColorText$ not defined');
    });
  });

  describe('#getter:value', () => {
    it(`should return the value`, () => {
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

    it(`should should emit true to ${nameof<ColorInputComponent>('isDarkColorText$')} if value changed and color luminance is above threshold`,
      (done: DoneFn) => {
        component.darkTextLuminanceThreshold = 0;
        const color = new Color('#abc123');

        component.isDarkColorText$.subscribe(isDarkColorText => {
          expect(isDarkColorText).toBe(true);
          done();
        });

        component.value = color;
    });

    it(`should should emit false to ${nameof<ColorInputComponent>('isDarkColorText$')} if value changed and color luminance is below threshold`,
      (done: DoneFn) => {
        component.darkTextLuminanceThreshold = 1;
        const color = new Color('#abc123');

        component.isDarkColorText$.subscribe(isDarkColorText => {
          expect(isDarkColorText).toBe(false);
          done();
        });

        component.value = color;
    });

    it('should set when value is null', () => {
      component.value = null;

      expect(component.value).toBeNull();
    });
  });

  describe('#ngOnInit', () => {
    it(`it should subscribe to ${nameof<DocumentClickService>('click$')}`, () => {
      const spy = spyOn(docClickService.click$, 'subscribe');

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    describe(`${nameof<DocumentClickService>('click$')} subscription`, () => {
      it(`should emit false to ${nameof<ColorInputComponent>('isEditing$')} if element does not contain event target`,
        (done: DoneFn) => {
          fixture.detectChanges();
          component.isEditing$.subscribe(isEditing => {
            expect(isEditing).toBe(false);
            done();
          });

          clickSource.next(new MouseEvent('click'));
        }
      );

      it(`should not call ${nameof<ColorInputComponent>('setIsEditing')} if element contains event target`, () => {
        const spy = spyOn(component, 'setIsEditing');
        fixture.detectChanges();
        clickSource.next({
          ...new MouseEvent('click'),
          target: (fixture.debugElement.nativeElement as HTMLElement).appendChild(document.createElement('div'))
        });


        expect(spy).not.toHaveBeenCalledWith(false);
      });

      it(`should not call ${nameof<ColorInputComponent>('setIsEditing')} if event is falsy`, () => {
        const spy = spyOn(component, 'setIsEditing');
        fixture.detectChanges();
        clickSource.next(null);

        fixture.detectChanges();

        expect(spy).not.toHaveBeenCalledWith(false);
      });
    });
  });

  describe('#ngOnDestroy', () => {
    it(`should unsubscribe from subscription to ${nameof<DocumentClickService>('click$')}`, () => {
      const unsubscribeSpy = jasmine.createSpy();
      spyOn(docClickService.click$, 'subscribe').and.returnValue(new Subscription(unsubscribeSpy));
      fixture.detectChanges();

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });
});
