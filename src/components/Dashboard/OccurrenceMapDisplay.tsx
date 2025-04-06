
import React, { useEffect, useRef } from 'react';
import { Occurrence } from '@/hooks/use-occurrence-data';
import { calculateMapCenter, determineZoomLevel, createInfoWindowContent } from '@/utils/maps-utils';

interface OccurrenceMapDisplayProps {
  occurrences: Occurrence[];
  isLoaded: boolean;
}

const OccurrenceMapDisplay: React.FC<OccurrenceMapDisplayProps> = ({ 
  occurrences, 
  isLoaded 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapInitialized = useRef(false);
  
  useEffect(() => {
    if (!isLoaded || !mapRef.current || !window.google) return;
    
    console.log("Initializing occurrence map");
    
    // Clear existing markers
    if (markersRef.current.length > 0) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    const validOccurrences = occurrences.filter(o => o.latitude && o.longitude);
    
    // Calculate map center and zoom
    const center = calculateMapCenter(validOccurrences);
    const zoom = determineZoomLevel(validOccurrences.length);
    
    // Initialize the map or update existing
    if (!googleMapRef.current) {
      googleMapRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        mapTypeControl: true,
        fullscreenControl: true,
        streetViewControl: false
      });
    } else {
      googleMapRef.current.setCenter(center);
      googleMapRef.current.setZoom(zoom);
    }
    
    // Add markers for each occurrence
    validOccurrences.forEach(occurrence => {
      if (occurrence.latitude && occurrence.longitude && googleMapRef.current) {
        const marker = new window.google.maps.Marker({
          position: { lat: occurrence.latitude, lng: occurrence.longitude },
          map: googleMapRef.current,
          title: occurrence.titulo,
          icon: {
            url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });
        
        // Create info window content
        const infoContent = createInfoWindowContent(
          occurrence.titulo,
          occurrence.local,
          occurrence.data
        );
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: infoContent
        });
        
        marker.addListener('click', () => {
          infoWindow.open(googleMapRef.current, marker);
        });
        
        markersRef.current.push(marker);
      }
    });
    
    mapInitialized.current = true;
    
    return () => {
      if (mapInitialized.current && markersRef.current.length > 0) {
        markersRef.current.forEach(marker => {
          if (marker) marker.setMap(null);
        });
      }
    };
  }, [isLoaded, occurrences]);
  
  return (
    <div 
      id="occurrenceMap" 
      ref={mapRef} 
      className="w-full h-[300px] md:h-[400px] relative"
    >
      {occurrences.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-80">
          <p className="text-gray-600 italic">
            Nenhuma ocorrência encontrada no período selecionado.
          </p>
        </div>
      )}
    </div>
  );
};

export default OccurrenceMapDisplay;
