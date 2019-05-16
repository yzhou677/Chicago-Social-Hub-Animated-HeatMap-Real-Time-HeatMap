////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////


/// This file and the source code provided can be used only for   
/// the projects and assignments of this course

/// Last Edit by Dr. Atef Bader: 1/30/2019


////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////



import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';


import { MatToolbarModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatIconModule, MatButtonModule, MatCardModule, MatTableModule, MatDividerModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { PlacesService } from './places.service';

import { FindComponent } from './components/find/find.component';
import { ListOfPlacesComponent } from './components/list-of-places/list-of-places.component';
import { ListOfStationsComponent } from './components/list-of-stations/list-of-stations.component';
import { HeatMapDivvyStationsComponent } from './components/heat-map-divvy-stations/heat-map-divvy-stations.component';
import { AnimatedHeatmapComponent } from './components/animated-heatmap/animated-heatmap.component';
import { HeatMapPlacesComponent } from './components/heat-map-places/heat-map-places.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeatMapConcretePlaceComponent } from './components/heat-map-concrete-place/heat-map-concrete-place.component';
import { AnimatedHeatMapConcretePlaceComponent } from './components/animated-heat-map-concrete-place/animated-heat-map-concrete-place.component';
import { GoogleMapStationsMarkerComponent } from './components/google-map-stations-marker/google-map-stations-marker.component';




const routes: Routes = [
  { path: 'find', component: FindComponent },
  {
    path: 'list_of_places', component: ListOfPlacesComponent,
    children: [
      { path: 'heat_map_places', component: HeatMapPlacesComponent },
      { path: 'heat_map_divvy_stations', component: HeatMapDivvyStationsComponent },
      { path: 'animated_heat_map', component: AnimatedHeatmapComponent }
    ]
  },
  {
    path: 'list_of_stations', component: ListOfStationsComponent,
    children: [
      { path: 'google_map_marker', component: GoogleMapStationsMarkerComponent},
      { path: 'heat_map_divvy_stations', component: HeatMapConcretePlaceComponent },
      { path: 'animated_heat_map', component: AnimatedHeatMapConcretePlaceComponent }
    ]
  },
  { path: '', redirectTo: 'find', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    FindComponent,
    ListOfPlacesComponent,
    ListOfStationsComponent,
    HeatMapDivvyStationsComponent,
    AnimatedHeatmapComponent,
    HeatMapPlacesComponent,
    HeatMapConcretePlaceComponent,
    AnimatedHeatMapConcretePlaceComponent,
    GoogleMapStationsMarkerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,

    /////////////////////////////////////////////////////////////////////////////////////    
    /////////////////////////// SETUP NEEDED ////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////

    //  1. Create your API key from Google Developer Website
    //  2. Install AGM package: npm install @agm/core @ng-bootstrap/ng-bootstrap --
    //  3. Here is the URL for an online IDE for NG and TS that could be used to experiment
    //  4. AGM live demo is loacted at this URL: https://stackblitz.com/edit/angular-google-maps-demo


    /////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////


    AgmCoreModule.forRoot({ apiKey: 'AIzaSyDUV9scwNM7z1zMru0jRmnIvcAXZW7wMvI' + '&libraries=visualization' }),
    FormsModule,
    NgbModule
  ],

  providers: [PlacesService, GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
