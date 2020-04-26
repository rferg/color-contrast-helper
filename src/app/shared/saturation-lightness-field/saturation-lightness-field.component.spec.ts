import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaturationLightnessFieldComponent } from './saturation-lightness-field.component';

describe('SaturationLightnessFieldComponent', () => {
  let component: SaturationLightnessFieldComponent;
  let fixture: ComponentFixture<SaturationLightnessFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaturationLightnessFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaturationLightnessFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
