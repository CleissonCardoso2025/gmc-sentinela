import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { MapMarker } from '@/types/maps';

export interface SimpleMapComponentProps {
  markers?: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  showUserLocation?: boolean;
  draggable?: boolean;
  onClick?: (marker: MapMarker) => void;
}

const SimpleMapComponent: React.FC<SimpleMapComponentProps> = ({
  markers = [],
  center = [-23.5505, -46.6333], // Default to São Paulo
  zoom = 12,
  className = '',
  onClick,
}) => {
  // Função para simular um clique no mapa
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onClick) return;
    
    // Simular uma posição baseada no clique na div
    // Isso é apenas um placeholder - em uma implementação real, você usaria
    // uma biblioteca de mapas que não dependa do Google Maps
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Simular uma posição geográfica baseada na posição do clique
    // Isso é apenas uma simulação simples
    const lat = center[0] + (y - rect.height / 2) / 1000;
    const lng = center[1] + (x - rect.width / 2) / 1000;
    
    const newMarker: MapMarker = {
      id: `marker-${Date.now()}`,
      position: [lat, lng],
      title: 'Localização selecionada',
      lat,
      lng,
      address: `Coordenadas: ${lat.toFixed(6)}, ${lng.toFixed(6)}`
    };
    
    onClick(newMarker);
  };

  return (
    <div 
      className={`relative w-full h-full min-h-[200px] bg-gray-100 border rounded-md ${className}`}
      onClick={onClick ? handleMapClick : undefined}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-gray-500">Mapa simplificado - clique para selecionar localização</p>
      </div>
      
      {/* Renderizar marcadores como pontos */}
      {markers.map((marker) => (
        <div
          key={marker.id}
          className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-2 -translate-y-2"
          style={{
            // Posicionar o marcador baseado na posição relativa ao centro
            left: `${50 + (marker.lng - center[1]) * 1000}%`,
            top: `${50 + (marker.lat - center[0]) * 1000}%`,
          }}
          title={marker.title}
        />
      ))}
    </div>
  );
};

export default SimpleMapComponent;
