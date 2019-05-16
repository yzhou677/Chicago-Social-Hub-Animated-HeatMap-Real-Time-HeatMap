import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../places.service';
import { Station } from '../../stationHeatMap';
import { Router } from '@angular/router';
import * as d3 from 'd3-selection';
import { element } from '@angular/core/src/render3';


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
  selector: 'app-heat-map-divvy-stations',
  templateUrl: './heat-map-divvy-stations.component.html',
  styleUrls: ['./heat-map-divvy-stations.component.css']
})
export class HeatMapDivvyStationsComponent implements OnInit, OnDestroy {

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  allStationsNearby: Station[] = [];
  stationsIdList: any[] = [];

  replace: number[] = [];

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
  constructor(private placesService: PlacesService, private router: Router) { }

  ngOnInit() {
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    this.placesService.getAllStationsNearbyPlaces().subscribe((data: any[]) => {
      console.log(data)
      this.allStationsNearby = data;
      this.stationsIdList = this.getStationsId();
      this.replace = this.stationsIdList.slice();
      this.buildHeatMap(this.allStationsNearby);

      let UpdateObservable = this.placesService.getUpdates(this.stationsIdList);
      UpdateObservable.subscribe((latestStatus: Station) => {
        this.replaceStatus(latestStatus);
      });
    });
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

    //this.heatmap.set("gradient", this.gradient);
    d3.selectAll("#date").text(stationInfo[0].lastCommunicationTime.valueOf());
  }

  replaceStatus(latestStatus) {
    for (let i = 0; i < this.allStationsNearby.length; i++) {
      if (this.allStationsNearby[i].id == latestStatus.id) {
        this.allStationsNearby[i] = latestStatus;
        this.replace[i] = 1;
      }
    }
    if (!this.replace.includes(0)) {
      this.buildHeatMap(this.allStationsNearby);
    }
  }

  getStationsId() {
    var stationId = [];
    this.allStationsNearby.forEach((station) => {
      stationId.push(station.id);
    })
    return stationId;
  }


  goToAnimatedHeatMap() {
    d3.selectAll("#google-map-container").style("opacity", 0);
    d3.selectAll("#loading-sign").style("opacity", 1);
    d3.selectAll("#buttons").style("opacity", 0);

    this.placesService.findStationsNearbyPlacesTwentyFourHours(this.stationsIdList).subscribe(() => {
      this.router.navigate(['/list_of_places/animated_heat_map']);
    });
  }

  changeGradient() {
    this.heatmap.set('gradient', this.heatmap.get('gradient') ? null : this.gradient);
  }

  public location: Location = {
    lat: 41.890000,
    lng: -87.643548,
    label: 'Chicago',
    zoom: 12.5
  };

  ngOnDestroy() {
    this.placesService.socketOff();
  }


}
