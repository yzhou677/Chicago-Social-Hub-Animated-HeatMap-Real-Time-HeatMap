////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpHeaders } from '@angular/common/http';



import { Observable, of } from 'rxjs';
import { catchError, map, tap, zip } from 'rxjs/operators';
import { Subject, from } from 'rxjs';

import * as socketio from 'socket.io-client';

import { Place } from './place';
import { Station } from './station';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  uri = 'http://localhost:4000';

  constructor(private http: HttpClient) {


  }



  getPlaces(): Observable<Place[]> {
    return this.http.get<Place[]>(`${this.uri}/places`);
  }


  getPlaceSelected() {
    return this.http.get(`${this.uri}/place_selected`);
  }


  getStations() {
    return this.http.get(`${this.uri}/stations`);
  }

  getAllStationsNearbyPlaces() {
    return this.http.get(`${this.uri}/find_all_stations_nearby`)
  }

  getStationsNearbyPlacesTwentyFourHours() {
    return this.http.get(`${this.uri}/stations_nearby_twenty_four_hours`)
  }

  findPlaces(find, where, zipcode) {
    const find_places_at = {
      find: find,
      where: where,
      zipcode: zipcode
    };

    return this.http.post(`${this.uri}/places/find`, find_places_at, httpOptions);

  }

  findStations(placeName) {
    const find_stations_at = {
      placeName: placeName
    };

    var str = JSON.stringify(find_stations_at, null, 2);


    return this.http.post(`${this.uri}/stations/find`, find_stations_at, httpOptions);

  }

  findAllStationsNearbyPlaces() {
    return this.http.post(`${this.uri}/stations/find_all_stations_nearby`, httpOptions);
  }

  findStationsNearbyPlacesTwentyFourHours(stationsIdList) {
    const find_stations_by = {
      stationsIdList: stationsIdList
    };
    return this.http.post(`${this.uri}/stations/find_all_stations_nearby_twenty_four_hours`,
      find_stations_by, httpOptions)
  }

  socket = socketio(this.uri);
  getUpdates(IdList) {
    console.log("listen on", IdList);
    let divvySub = new Subject<Station>();
    let divvySubObservable = from(divvySub);
    IdList.forEach(element => {
      this.socket.on(element, (stationStatus: Station) => {
        divvySub.next(stationStatus);
      });
    });

    return divvySubObservable;
  }

  socketOff() {
    this.socket.removeAllListeners();
    console.log("socket off")
  }

}
