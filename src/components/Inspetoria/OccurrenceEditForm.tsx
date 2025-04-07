
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Occurrence } from "@/hooks/use-occurrence-data";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OccurrenceEditFormProps {
  occurrence: Occurrence;
  onSave: (updatedOccurrence: Occurrence) => void;
  onCancel: () => void;
}

const OccurrenceEditForm: React.FC<OccurrenceEditFormProps> = ({ 
  occurrence, 
  onSave, 
  onCancel 
}) => {
  const [title, setTitle] = useState(occurrence.titulo);
  const [location, setLocation] = useState(occurrence.local);
  const [description, setDescription] = useState(occurrence.descricao || "");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !location.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Título e local são campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    onSave({
      ...occurrence,
      titulo: title,
      local: location,
      descricao: description
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Editar Ocorrência</h3>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onCancel}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título da ocorrência"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Local da ocorrência"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detalhes da ocorrência"
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar Alterações
        </Button>
      </div>
    </form>
  );
};

export default OccurrenceEditForm;
