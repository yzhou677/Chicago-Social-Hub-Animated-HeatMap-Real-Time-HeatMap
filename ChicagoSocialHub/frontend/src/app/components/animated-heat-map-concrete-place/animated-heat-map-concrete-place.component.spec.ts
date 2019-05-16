import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedHeatMapConcretePlaceComponent } from './animated-heat-map-concrete-place.component';

describe('AnimatedHeatMapConcretePlaceComponent', () => {
  let component: AnimatedHeatMapConcretePlaceComponent;
  let fixture: ComponentFixture<AnimatedHeatMapConcretePlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedHeatMapConcretePlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedHeatMapConcretePlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
