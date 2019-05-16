import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../places.service';

import { Place } from 'src/app/place';
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
  selector: 'app-heat-map-places',
  templateUrl: './heat-map-places.component.html',
  styleUrls: ['./heat-map-places.component.css']
})
export class HeatMapPlacesComponent implements OnInit {
  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  places: Place[] = [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
  }



  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;

    this.placesService
      .getPlaces()
      .subscribe((data: Place[]) => {
        this.places = data;
        this.buildHeatMapReviewCounts();

      });
  }

  buildHeatMapReviewCounts() {
    const coords = [];
    this.places.forEach(element => {
      // can also be a google.maps.MVCArray with LatLng[] inside    
      coords.push({
        location: new google.maps.LatLng(element.latitude.valueOf(),
          element.longitude.valueOf()), weight: Number(element.review_count.valueOf()).valueOf()
      });
    });
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: coords
    });
    this.heatmap.set('opacity', 1);
    this.heatmap.set('radius', 20);
  }

  heatMapReviewCounts() {
    d3.selectAll("#dropdownBasic1").text("Review Counts");
    this.buildHeatMapReviewCounts();
  }

  heatMapRatings() {
    d3.selectAll("#dropdownBasic1").text("Ratings");
    this.buildHeatMapRatings();
  }

  buildHeatMapRatings() {
    const coords = []
    this.places.forEach(element => {
      // can also be a google.maps.MVCArray with LatLng[] inside    
      coords.push({
        location: new google.maps.LatLng(element.latitude.valueOf(),
          element.longitude.valueOf()), weight: Number(element.rating.valueOf()).valueOf()
      });
    });
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: coords
    });
    this.heatmap.set('opacity', 1);
    this.heatmap.set('radius', 20);
  }

  public location: Location = {
    lat: 41.882607,
    lng: -87.643548,
    label: 'You are Here',
    zoom: 13
  };

}
