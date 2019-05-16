import { Component, OnInit } from '@angular/core';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';

import { Place } from 'src/app/place';
interface Location {
  lat: number;
  lng: number;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  label: string;
}

@Component({
  selector: 'app-google-map-stations-marker',
  templateUrl: './google-map-stations-marker.component.html',
  styleUrls: ['./google-map-stations-marker.component.css']
})
export class GoogleMapStationsMarkerComponent implements OnInit {

  stations: Station[];
  markers: Station[];
  placeSelected: Place;

  icon = {
    url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    scaledSize: {
      width: 60,
      height: 60
    }
  }
  
  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.fetchStations();
    this.getPlaceSelected();
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  fetchStations() {
    this.placesService
      .getStations()
      .subscribe((data: Station[]) => {
        this.stations = data;
        this.markers = data;
      });
  }


  getPlaceSelected() {
    this.placesService
      .getPlaceSelected()
      .subscribe((data: Place) => {
        this.placeSelected = data;

      });
  }

  circleRadius: number = 3000; // km

  public location: Location = {
    lat: 41.882607,
    lng: -87.643548,
    label: 'Chicago',
    zoom: 13
  };

}
