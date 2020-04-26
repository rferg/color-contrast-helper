import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HueSliderComponent } from './hue-slider.component';

describe('HueSliderComponent', () => {
  let component: HueSliderComponent;
  let fixture: ComponentFixture<HueSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HueSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HueSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
