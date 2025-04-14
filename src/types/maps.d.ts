
// Type definitions for Leaflet maps and geolocation

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string | number;
  position: [number, number]; // [latitude, longitude]
  title: string;
  content?: string;
  icon?: string;
  lat: number;
  lng: number;
  address?: string;
}
