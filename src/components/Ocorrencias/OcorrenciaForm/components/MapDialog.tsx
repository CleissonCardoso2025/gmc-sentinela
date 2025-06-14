
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SimpleMapComponent from '@/components/Map/SimpleMap';
import { useOcorrenciaForm } from '../OcorrenciaFormContext';

const MapDialog = () => {
  const {
    position,
    handleMapClick,
    showMap,
    setShowMap
  } = useOcorrenciaForm();

  return (
    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Selecionar Localização</DialogTitle>
          <DialogDescription>
            Clique no mapa para definir a localização da ocorrência
          </DialogDescription>
        </DialogHeader>
        <div className="h-[400px] w-full">
          <SimpleMapComponent
            markers={position ? [position] : []}
            zoom={13}
            showUserLocation={true}
            draggable={true}
            className="w-full h-full"
            onClick={handleMapClick}
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setShowMap(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
