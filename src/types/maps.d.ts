
export interface MapMarker {
  id: string;
  position: [number, number];
  title: string;
  lat: number;
  lng: number;
  address?: string;
  content?: string;
  icon?: string;
}
