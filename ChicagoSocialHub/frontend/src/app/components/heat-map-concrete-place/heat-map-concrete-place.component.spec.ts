import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapConcretePlaceComponent } from './heat-map-concrete-place.component';

describe('HeatMapConcretePlaceComponent', () => {
  let component: HeatMapConcretePlaceComponent;
  let fixture: ComponentFixture<HeatMapConcretePlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapConcretePlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapConcretePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
