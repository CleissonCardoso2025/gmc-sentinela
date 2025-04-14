
import React, { useState } from 'react';
import Dashboard from '@/layouts/Dashboard';
import { NovaInvestigacao } from '@/components/Corregedoria/NovaInvestigacao';
import { InvestigacaoList } from '@/components/Corregedoria/InvestigacaoList';
import { InvestigationStats } from '@/components/Corregedoria/InvestigationStats';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Corregedoria = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dashboard>
      <div className="container mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gcm-600">Corregedoria - Gestão de Sindicâncias</h1>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Sindicância
          </Button>
        </div>
        
        <InvestigationStats />
        
        <InvestigacaoList />
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Nova Sindicância</DialogTitle>
            </DialogHeader>
            <NovaInvestigacao onComplete={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </Dashboard>
  );
};

export default Corregedoria;
