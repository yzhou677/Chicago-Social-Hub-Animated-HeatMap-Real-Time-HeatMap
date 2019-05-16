import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../places.service';

import { Router } from '@angular/router';
import { Station } from '../../station';
import * as d3 from 'd3-selection';

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
  selector: 'app-heat-map-concrete-place',
  templateUrl: './heat-map-concrete-place.component.html',
  styleUrls: ['./heat-map-concrete-place.component.css']
})
export class HeatMapConcretePlaceComponent implements OnInit, OnDestroy {
  gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]

  stations: Station[];
  stationsIdList: number[];

  replace: number[] = [];


  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    this.placesService.getStations().subscribe((data: any[]) => {
      this.stations = data;
      this.stationsIdList = this.getStationsId();
      this.replace = this.stationsIdList.slice();

      this.buildHeatMap(this.stations);
      let UpdateObservable = this.placesService.getUpdates(this.stationsIdList);
      UpdateObservable.subscribe((latestStatus: Station) => {
        this.replaceStatus(latestStatus);
      });
    });
  }

  replaceStatus(latestStatus) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id == latestStatus.id) {
        this.stations[i] = latestStatus;
        this.replace[i] = 1;
      }
    }
    if (!this.replace.includes(0)) {
      this.buildHeatMap(this.stations);
    }
  }

  buildHeatMap(stationInfo) {
    this.replace.fill(0);
    // const coords = [{
    //   location: new google.maps.LatLng(90.000000, 135.000000), weight: 55
    // },
    // { location: new google.maps.LatLng(90.000000, 130.000000), weight: 0 }
    // ]
    const coords = [];
    stationInfo.forEach(element => {
      // can also be a google.maps.MVCArray with LatLng[] inside    
      coords.push({
        location: new google.maps.LatLng(element.latitude.valueOf(),
          element.longitude.valueOf()), weight: Number(element.availableDocks.valueOf()).valueOf()
      });
    });

    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: coords
    });
    this.heatmap.set('radius', 20);
    this.heatmap.set('opacity', 2);
    d3.selectAll("#date").text(stationInfo[0].lastCommunicationTime.valueOf());
  }

  goToAnimatedHeatMap() {
    d3.selectAll("#google-map-container").style("opacity", 0);
    d3.selectAll("#loading-sign").style("opacity", 1);
    d3.selectAll("#buttons").style("opacity", 0);

    this.placesService.findStationsNearbyPlacesTwentyFourHours(this.stationsIdList).subscribe(() => {
      this.router.navigate(['/list_of_stations/animated_heat_map']);
    });
  }

  changeGradient() {
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : this.gradient);
  }

  getStationsId() {
    var stationId = [];
    this.stations.forEach((station) => {
      stationId.push(station.id);
    })
    return stationId;
  }

  public location: Location = {
    lat: 41.890000,
    lng: -87.643548,
    label: 'Chicago',
    zoom: 13.5
  };

  ngOnDestroy() {
    this.placesService.socketOff();
  }


}
