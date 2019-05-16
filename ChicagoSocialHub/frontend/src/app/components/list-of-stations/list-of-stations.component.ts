////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////




import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

import { Station } from '../../station';
import { PlacesService } from '../../places.service';


import { Input, ViewChild, NgZone } from '@angular/core';
import { MapsAPILoader, AgmMap } from '@agm/core';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { Place } from 'src/app/place';




@Component({
  selector: 'app-list-of-stations',
  templateUrl: './list-of-stations.component.html',
  styleUrls: ['./list-of-stations.component.css']
})
export class ListOfStationsComponent implements OnInit {

  stations: Station[];
  markers: Station[];
  placeSelected: Place;


  displayedColumns = ['id', 'stationName', 'availableBikes', 'availableDocks', 'is_renting', 'lastCommunicationTime', 'latitude', 'longitude', 'status', 'totalDocks'];

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
    this.fetchStations();
    this.getPlaceSelected();
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




}



