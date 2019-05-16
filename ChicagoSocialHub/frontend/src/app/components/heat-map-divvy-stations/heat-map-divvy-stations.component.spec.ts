import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatMapDivvyStationsComponent } from './heat-map-divvy-stations.component';

describe('HeatMapDivvyStationsComponent', () => {
  let component: HeatMapDivvyStationsComponent;
  let fixture: ComponentFixture<HeatMapDivvyStationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeatMapDivvyStationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeatMapDivvyStationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
