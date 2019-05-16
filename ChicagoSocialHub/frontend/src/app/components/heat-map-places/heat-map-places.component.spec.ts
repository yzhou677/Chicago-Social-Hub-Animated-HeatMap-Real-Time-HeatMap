import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapPlacesComponent } from './heat-map-places.component';

describe('HeatMapPlacesComponent', () => {
  let component: HeatMapPlacesComponent;
  let fixture: ComponentFixture<HeatMapPlacesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapPlacesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapPlacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
