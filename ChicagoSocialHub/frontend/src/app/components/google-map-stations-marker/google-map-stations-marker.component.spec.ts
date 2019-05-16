import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleMapStationsMarkerComponent } from './google-map-stations-marker.component';

describe('GoogleMapStationsMarkerComponent', () => {
  let component: GoogleMapStationsMarkerComponent;
  let fixture: ComponentFixture<GoogleMapStationsMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoogleMapStationsMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoogleMapStationsMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
