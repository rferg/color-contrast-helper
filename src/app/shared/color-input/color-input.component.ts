import { Component, ChangeDetectionStrategy, forwardRef, OnDestroy, ElementRef, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Color } from 'src/app/core/models/color';
import { Subject, Observable, Subscription } from 'rxjs';
import { Rgb } from 'src/app/core/models/rgb';
import { DocumentClickService } from 'src/app/core/services/document-click.service';

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
  private _value: Color;
  get value(): Color {
    return this._value;
  }
  set value(color: Color) {
    if (color !== this._value) {
      this._value = color;
      if (this.onChange) { this.onChange(this._value); }
      if (this._value) { this.isDarkColorTextSource.next(this._value.relativeLuminance > 0.333); }
    }
  }
  private onChange: (v: Color) => void;
  private onTouched: (v: Color) => void;

  private documentClickSubscription: Subscription;

  private isDisabledSource = new Subject<boolean>();
  isDisabled$: Observable<boolean> = this.isDisabledSource.asObservable();

  private isEditingSource = new Subject<boolean>();
  isEditing$: Observable<boolean> = this.isEditingSource.asObservable();

  private isDarkColorTextSource = new Subject<boolean>();
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

  writeValue(value: Color): void {
    this.value = value;
  }

  registerOnChange(fn: (v: Color) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: (v: Color) => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabledSource.next(isDisabled);
  }

  onBlur(): void {
    if (this.onTouched) { this.onTouched(this.value); }
  }

  onHexChange(hex: string): void {
    try {
      const newColor = new Color(hex);
      this.value = newColor;
    } catch (error) {
      console.error(error);
    }
  }

  onRgbChange(value: number, component: 'r'|'g'|'b'): void {
    const newRgbValues = {
      ...(this.value || new Color('#000')).rgb,
      [component]: value
    };
    this.value = new Color(
      Color.convertRgbToHex(new Rgb(newRgbValues)));
  }

  setIsEditing(isEditing: boolean): void {
    this.isEditingSource.next(isEditing);
  }

}
