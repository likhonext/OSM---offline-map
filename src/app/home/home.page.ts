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
import 'leaflet-draw';
import { GeometryGroup } from 'three';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage implements OnInit {
  private map: L.Map;
  private drawnItems = L.featureGroup();
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
    setTimeout(() => this.drawPolygonFromLocalStorage(), 200);
    // setTimeout(()=> this.initDrawingTools(),100)
    setTimeout(() => this.initDrawingTools(), 100);

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
    this.map = L.map('map', {
      doubleClickZoom: false, // Disable double-click zoom
    }).setView(this.centroid, 13);
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
      saveTilesButton.addEventListener('mouseenter', () => {
        (saveTilesButton as HTMLElement).style.backgroundColor = '#2A8B76';
      });
      saveTilesButton.addEventListener('mouseleave', () => {
        (saveTilesButton as HTMLElement).style.backgroundColor = '#3CB4AA';
      });
    }
  }

  private initDrawingTools() {
    // Configure draw controls
    const customVertex = L.divIcon({
      className: 'custom-vertex', // Custom CSS class
      iconSize: [15, 15], // Size of the vertex
      html: '<div style="background-color: #007bff; width: 15px; height: 15px; border-radius: 50%;"></div>',
    });
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: {
          allowIntersection: true,
          showArea: true,
          shapeOptions: {
            color: 'blue',
          },
          icon: customVertex,
        },
        circle: false,
        rectangle: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: this.drawnItems,
        remove: true,
      },
    });

    // Add controls to map
    this.map.addControl(drawControl);

    // Handle drawing events
    this.map.on(L.Draw.Event.CREATED, (e: any) => this.handleLayerCreated(e));
  }

  private handleLayerCreated(e: any) {
    console.log(e);
    const layer = e.layer;
    this.drawnItems.addLayer(layer);
    this.createPolygonShow(layer.editing.latlngs[0]);
    localStorage.setItem('polygons', JSON.stringify(layer.editing.latlngs[0]));
  }

  private createPolygonShow(latLngs: any) {
    const polygon = new L.Polygon(latLngs, {
      color: 'blue',
      weight: 3,
      fillColor: 'lightblue',
      fillOpacity: 0.5,
    }).addTo(this.map);
  }

  async drawPolygonFromLocalStorage(): Promise<void> {
    const polygons = localStorage.getItem('polygons');

    if (polygons) {
      console.log(JSON.parse(polygons));

      const polygon = new L.Polygon(JSON.parse(polygons), {
        color: 'blue',
        weight: 3,
        fillColor: 'lightblue',
        fillOpacity: 0.5,
      }).addTo(this.map);
    } else {
      console.log('No polygons found in localStorage');
    }
  }
}
