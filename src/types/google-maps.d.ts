
/// <reference types="google.maps" />

declare global {
  interface Window {
    google: {
      maps: {
        Map: any;
        Marker: any;
        InfoWindow: any;
        LatLng: any;
        Size: any;
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
        places?: any;
      };
    };
    initMap: () => void;
    mapsCallback?: () => void;
    [key: string]: any; // Allow for dynamic callback names
  }
}

export {};
