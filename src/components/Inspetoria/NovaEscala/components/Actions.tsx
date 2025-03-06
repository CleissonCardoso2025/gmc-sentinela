
import React from 'react';
import { Button } from "@/components/ui/button";
import { ActionsProps } from '../types';

const Actions: React.FC<ActionsProps> = ({ onCancel, onSave, isDisabled }) => {
  return (
    <div className="flex justify-end space-x-4 mt-8 animate-fade-in">
      <Button 
        variant="outline" 
        onClick={onCancel}
        className="transition-all duration-200 hover:opacity-80"
      >
        Cancelar
      </Button>
      <Button 
        onClick={onSave}
        disabled={isDisabled}
        className="transition-all duration-200 hover:opacity-90"
      >
        Salvar Escala
      </Button>
    </div>
  );
};

export default Actions;
