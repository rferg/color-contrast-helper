import { Component, ChangeDetectionStrategy, forwardRef, OnDestroy, ElementRef, OnInit, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Color } from 'src/app/core/models/color';
import { Subject, Observable, Subscription } from 'rxjs';
import { Rgb } from 'src/app/core/models/rgb';
import { DocumentClickService } from 'src/app/core/services/document-click.service';

/**
 * Form control component for {@link Color} values.
 */
@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styleUrls: ['./color-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ColorInputComponent),
    multi: true
  }]
})
export class ColorInputComponent implements ControlValueAccessor, OnInit, OnDestroy {
  /**
   * The relative luminance of the value color, above which a dark color is used
   * for the input text.
   * Should be between 0 and 1.
   * Default value is 1/3.
   */
  @Input() darkTextLuminanceThreshold = 1 / 3;
  private _value: Color;
  /**
   * Gets the color value for this input.
   */
  get value(): Color {
    return this._value;
  }
  /**
   * Sets the color value for this input
   */
  set value(color: Color) {
    if (color !== this._value) {
      this._value = color;
      if (this.onChange) { this.onChange(this._value); }
      if (this._value) {
        this.isDarkColorTextSource.next(this._value.relativeLuminance > (this.darkTextLuminanceThreshold || 0));
      }
    }
  }
  private onChange: (v: Color) => void;
  private onTouched: (v: Color) => void;

  private documentClickSubscription: Subscription;

  private isDisabledSource = new Subject<boolean>();
  /**
   * Emits the disabled state of the input.
   */
  isDisabled$: Observable<boolean> = this.isDisabledSource.asObservable();

  private isEditingSource = new Subject<boolean>();
  /**
   * Emits whether input value is being edited.
   */
  isEditing$: Observable<boolean> = this.isEditingSource.asObservable();

  private isDarkColorTextSource = new Subject<boolean>();
  /**
   * Emits whether the input text color should be dark.
   */
  isDarkColorText$ = this.isDarkColorTextSource.asObservable();

  constructor(
    private documentClickService: DocumentClickService,
    private elementRef: ElementRef) { }

  ngOnInit() {
    this.documentClickSubscription = this.documentClickService.click$.subscribe(event => {
      const nativeElement = this.elementRef && this.elementRef.nativeElement as HTMLElement;
      if (nativeElement && event && !nativeElement.contains(event.target as Node)) {
        this.setIsEditing(false);
      }
    });
  }

  ngOnDestroy() {
    if (this.documentClickSubscription) { this.documentClickSubscription.unsubscribe(); }
  }

  /**
   * Sets the input to have the provided value.
   * @param value the {@link Color} to set as the value.
   */
  writeValue(value: Color): void {
    this.value = value;
  }
  /**
   * Registers a callback to be called when the value is changed.
   * @param fn the callback to call when value is changed
   */
  registerOnChange(fn: (v: Color) => void): void {
    this.onChange = fn;
  }
  /**
   * Registers a callback to be called when input is blurred.
   * @param fn the callback to call when input is blurred.
   */
  registerOnTouched(fn: (v: Color) => void): void {
    this.onTouched = fn;
  }
  /**
   * Sets disabled state of the input
   * @param isDisabled whether the input should be disabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabledSource.next(isDisabled);
  }
  /**
   * Called when input is blurred
   */
  onBlur(): void {
    if (this.onTouched) { this.onTouched(this.value); }
  }
  /**
   * Called when value of hex input element changes.
   * @param hex the hex value it was changed to
   */
  onHexChange(hex: string): void {
    try {
      const newColor = new Color(hex);
      this.value = newColor;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   * Called when value of one of the RGB input elements changes.
   * @param value the value changed to
   * @param component which of R, G, or B inputs changed
   */
  onRgbChange(value: number, component: 'r'|'g'|'b'): void {
    const newRgbValues = {
      ...(this.value || new Color('#000')).rgb,
      [component]: value
    };
    this.value = new Color(
      Color.convertRgbToHex(new Rgb(newRgbValues)));
  }

  /**
   * Sets the editing state of the input.
   * @param isEditing whether input is being edited
   */
  setIsEditing(isEditing: boolean): void {
    this.isEditingSource.next(isEditing);
  }

}
