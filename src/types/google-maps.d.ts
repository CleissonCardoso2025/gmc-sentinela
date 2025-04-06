
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        InfoWindow: typeof google.maps.InfoWindow;
        LatLng: typeof google.maps.LatLng;
        Size: typeof google.maps.Size;
        MapTypeId: {
          ROADMAP: string;
          SATELLITE: string;
          HYBRID: string;
          TERRAIN: string;
        };
        MapTypeControlStyle: {
          DEFAULT: string;
          HORIZONTAL_BAR: string;
          DROPDOWN_MENU: string;
          INSET: string;
          INSET_LARGE: string;
        };
      };
    };
    initMap: () => void;
  }
}

export {};
