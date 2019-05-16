import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../../places.service';
import { Station } from '../../stationHeatMap';
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
  selector: 'app-animated-heatmap',
  templateUrl: './animated-heatmap.component.html',
  styleUrls: ['./animated-heatmap.component.css']
})
export class AnimatedHeatmapComponent implements OnInit, OnDestroy {

  private map: google.maps.Map = null;
  private heatmap: google.maps.visualization.HeatmapLayer = null;

  lastHalfHourDivvyData = [];
  lastTwentyFourHoursDivvyData = [];
  stationsIdList: any[] = [];
  setInterval: any;
  stationIndex = 0;
  stationDivvyData = [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {

  }


  getWithinHalfHourData() {
    var stationDataHalfHour = [];
    var dateBegin = new Date();
    var withinHalfHourIndex = 0;
    for (let i = 0; i < this.lastTwentyFourHoursDivvyData.length; i++) {
      var dateEnd = new Date(this.lastTwentyFourHoursDivvyData[i][0].lastCommunicationTime.valueOf());
      var dateDiff = dateBegin.getTime() - dateEnd.getTime();
      var leave1 = dateDiff % (24 * 3600 * 1000);
      var hours = leave1 / (3600 * 1000);
      if (hours <= 0.5) {
        withinHalfHourIndex = withinHalfHourIndex + 1;
        //stationDataOneHour.push(this.lastTwentyFourHoursDivvyData[i])
      } else {
        break;
      }
    }
    stationDataHalfHour = this.lastTwentyFourHoursDivvyData.slice(0, withinHalfHourIndex);
    return stationDataHalfHour;
  }
  callAtTimeOut() {
    this.stationIndex = this.stationIndex - 1;
    if (this.stationIndex >= 0) {
      this.buildHeatMap(this.stationDivvyData[this.stationIndex]);

    }
  }
  callAtInterval() {
    if (this.stationIndex - 1 < 0) {
      clearInterval(this.setInterval);
      d3.selectAll('#play-button').style("opacity", 1);
      console.log("done")
      //d3.selectAll('#play-button').style("opacity", 1);
    } else {
      setTimeout(this.callAtTimeOut.bind(this), 500);
    }
  }

  halfHourAnimatedMap() {
    d3.selectAll("#dropdownBasic1").text("Last 30 Minutes Animated HeatMap");
    d3.selectAll('#play-button').style("opacity", 0);
    clearInterval(this.setInterval);
    this.stationDivvyData = this.lastHalfHourDivvyData;
    this.stationIndex = this.lastHalfHourDivvyData.length - 1;
    this.buildHeatMap(this.stationDivvyData[this.stationIndex]);
    this.setInterval = setInterval(this.callAtInterval.bind(this), 500);
  }

  twentyFourHoursAnimatedMap() {
    d3.selectAll("#dropdownBasic1").text("Last 24 Hours Animated HeatMap");
    d3.selectAll('#play-button').style("opacity", 0);
    clearInterval(this.setInterval);
    this.stationDivvyData = this.lastTwentyFourHoursDivvyData;
    this.stationIndex = this.lastTwentyFourHoursDivvyData.length - 1;
    this.buildHeatMap(this.stationDivvyData[this.stationIndex]);
    this.setInterval = setInterval(this.callAtInterval.bind(this), 2000);
  }

  onMapLoad(mapInstance: google.maps.Map) {
    this.map = mapInstance;
    this.placesService.getStationsNearbyPlacesTwentyFourHours().subscribe((data: Station[]) => {
      clearInterval(this.setInterval);
      this.lastTwentyFourHoursDivvyData = data;
      this.lastHalfHourDivvyData = this.getWithinHalfHourData();
      this.stationDivvyData = this.lastHalfHourDivvyData;
      this.stationIndex = this.lastHalfHourDivvyData.length - 1;
      this.buildHeatMap(this.stationDivvyData[this.stationIndex]);

      this.setInterval = setInterval(this.callAtInterval.bind(this), 1000);
    });
  }

  public location: Location = {
    lat: 41.890000,
    lng: -87.643548,
    label: 'Chicago',
    zoom: 13.5
  };

  playAnimateAgain() {
    d3.selectAll('#play-button').style("opacity", 0);
    this.stationIndex = this.stationDivvyData.length - 1;
    this.buildHeatMap(this.stationDivvyData[this.stationIndex]);
    this.setInterval = setInterval(this.callAtInterval.bind(this), 1000);
  }

  stopPlayAnimate() {
    clearInterval(this.setInterval);
    d3.selectAll('#play-button').style("opacity", 1);
  }

  buildHeatMap(stationInfo) {
    // const coords = [{
    //   location: new google.maps.LatLng(90.000000, 135.000000), weight: 55
    // },
    // { location: new google.maps.LatLng(90.000000, 130.000000), weight: 0 }
    // ]
    const coords = [];
    for (let i = 0; i < stationInfo.length; i++) {
      coords.push({
        location: new google.maps.LatLng(stationInfo[i].latitude.valueOf(),
          stationInfo[i].longitude.valueOf()), weight: Number(stationInfo[i].availableDocks.valueOf()).valueOf()
      });
    }
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      map: this.map,
      data: coords
    });
    this.heatmap.set('radius', 20);
    this.heatmap.set('opacity', 2);

    d3.selectAll("#date").text(stationInfo[0].lastCommunicationTime.valueOf());
  }

  ngOnDestroy() {
    clearInterval(this.setInterval);
  }

}
