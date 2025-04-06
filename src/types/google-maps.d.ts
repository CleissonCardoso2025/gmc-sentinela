
declare namespace google {
  namespace maps {
    class Map {
      constructor(element: HTMLElement, options?: MapOptions);
      setCenter(latLng: LatLng | LatLngLiteral): void;
      setZoom(zoom: number): void;
      setOptions(options: MapOptions): void;
      getCenter(): LatLng;
      getZoom(): number;
    }
    
    class Marker {
      constructor(options?: MarkerOptions);
      setPosition(latLng: LatLng | LatLngLiteral): void;
      setMap(map: Map | null): void;
      addListener(event: string, handler: Function): MapsEventListener;
    }
    
    class InfoWindow {
      constructor(options?: InfoWindowOptions);
      setContent(content: string | Node): void;
      open(map?: Map, anchor?: Marker): void;
      close(): void;
    }
    
    interface MapsEventListener {
      remove(): void;
    }
    
    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
      mapTypeId?: string;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
    }
    
    interface MarkerOptions {
      position?: LatLng | LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: string | Icon | Symbol;
      clickable?: boolean;
    }
    
    interface InfoWindowOptions {
      content?: string | Node;
      position?: LatLng | LatLngLiteral;
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    
    interface Icon {
      url?: string;
      size?: Size;
      origin?: Point;
      anchor?: Point;
      scaledSize?: Size;
    }
    
    interface Symbol {
      path: string | number;
      fillColor?: string;
      fillOpacity?: number;
      scale?: number;
      strokeColor?: string;
      strokeOpacity?: number;
      strokeWeight?: number;
    }
    
    interface Size {
      width: number;
      height: number;
    }
    
    interface Point {
      x: number;
      y: number;
    }
    
    const MapTypeId: {
      ROADMAP: string;
      SATELLITE: string;
      HYBRID: string;
      TERRAIN: string;
    };
    
    const SymbolPath: {
      CIRCLE: number;
      FORWARD_CLOSED_ARROW: number;
      FORWARD_OPEN_ARROW: number;
      BACKWARD_CLOSED_ARROW: number;
      BACKWARD_OPEN_ARROW: number;
    };
  }
}
