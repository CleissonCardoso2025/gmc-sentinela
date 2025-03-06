
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, Printer, Calendar as CalendarIcon } from "lucide-react";

interface EscalaActionsProps {
  handleExportPDF: () => void;
  handlePrint: () => void;
  openCreateModal: () => void;
}

const EscalaActions: React.FC<EscalaActionsProps> = ({
  handleExportPDF,
  handlePrint,
  openCreateModal
}) => {
  return (
    <div className="flex gap-2 w-full md:w-auto">
      <Button variant="outline" size="sm" onClick={handleExportPDF}>
        <Download className="h-4 w-4 mr-2" />
        Exportar
      </Button>
      <Button variant="outline" size="sm" onClick={handlePrint}>
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
      <Button size="sm" onClick={openCreateModal}>
        <CalendarIcon className="h-4 w-4 mr-2" />
        Nova Escala
      </Button>
    </div>
  );
};

export default EscalaActions;
