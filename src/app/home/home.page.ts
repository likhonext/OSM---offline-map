import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import * as L from 'leaflet';
import 'leaflet.offline';
import * as localforage from 'localforage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  private map: L.Map;
  private centroid: L.LatLngExpression = [-1.292066, 36.821945];

  /*
    1. In NgOnInit - without using SetTimeOut and 100sec - MAP and Polygon is not loaded.
    2. MAP design fully loaded when using leaflet.css to NgOnInit
  */

  ngOnInit(): void {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    setTimeout(() => this.initMap(), 100);
    setTimeout(() => this.drawPolygon(), 100);

    // Reload based Status Show in console
    if (navigator.onLine) {
      console.log('Online');
    } else {
      console.log('Offline');
    }
    // Reload based Status Show in console

    // Status Show in Console - When Network gone
    window.addEventListener('online', () => {
      console.log('going to online');
    });
    window.addEventListener('offline', () => {
      console.log('going to offline');
    });
    // Status Show in Console - When Network gone
  }

  private initMap(): void {
    this.map = L.map('map').setView(this.centroid, 13);
    // Create offline tile layer with caching
    const offlineLayer = (L.tileLayer as any)
      .offline(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        localforage
      )
      .addTo(this.map);
    // Added controls for manual cache management
    const control = (L as any).control.savetiles(offlineLayer, {
      zoomlevels: [12, 16], // Range
    });
    control.addTo(this.map);

    // Select the parent div of - SAVE TILES
    const parentDiv = document.querySelector('.savetiles.leaflet-bar');
    (parentDiv as HTMLElement).style.border = 'none';

    const saveTilesButton = document.querySelector('a.savetiles');

    // From DOM Element - Removing the Delete tiles Button
    const deleteTilesButton = document.querySelector('a.rmtiles');
    (deleteTilesButton as HTMLElement).style.display = 'none';

    // Style the SAVE button
    if (saveTilesButton) {
      (saveTilesButton as HTMLElement).style.backgroundColor = '#3CB4AA';
      (saveTilesButton as HTMLElement).style.color = 'white';
      (saveTilesButton as HTMLElement).style.width = '100px';
      (saveTilesButton as HTMLElement).style.fontSize = '16px';
      (saveTilesButton as HTMLElement).textContent = 'Save';

      // Button Hover Effect - Start
      saveTilesButton.addEventListener('mouseenter', () => {
        (saveTilesButton as HTMLElement).style.backgroundColor = '#2A8B76';
      });
      saveTilesButton.addEventListener('mouseleave', () => {
        (saveTilesButton as HTMLElement).style.backgroundColor = '#3CB4AA';
      });
      // Button Hover Effect - End
    }
  }
  // Added Custom Polygon to Nairobi
  private drawPolygon(): void {
    const polygonCoordinates: L.LatLngExpression[] = [
      [-1.292, 36.821],
      [-1.293, 36.822],
      [-1.294, 36.82],
      [-1.292, 36.819],
    ];
    const polygon = new L.Polygon(polygonCoordinates, {
      color: 'blue',
      fillColor: 'lightblue',
      fillOpacity: 0.5,
    });
    this.map.addLayer(polygon);

    // Current polygon - Center Lat and Lng
    const centroids = polygon.getBounds().getCenter();
    // The Marker add to the map based on centroid - lat and lng
    L.marker(centroids).addTo(this.map);
  }
}
