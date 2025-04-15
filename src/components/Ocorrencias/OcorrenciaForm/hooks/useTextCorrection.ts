
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTextCorrection = (text: string, setText: (value: string) => void) => {
  const [isCorrectingText, setIsCorrectingText] = useState(false);
  const { toast } = useToast();

  const handleCorrectText = async () => {
    if (!text.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, escreva uma descrição primeiro",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsCorrectingText(true);
      toast({
        title: "Corrigindo texto",
        description: "Aguarde enquanto corrigimos o texto..."
      });

      const { data, error } = await supabase.functions.invoke('text-correction', {
        body: { text }
      });

      if (error) {
        throw error;
      }

      if (data && data.correctedText) {
        setText(data.correctedText);
        toast({
          title: "Sucesso",
          description: "Texto corrigido com sucesso"
        });
      } else {
        throw new Error('Resposta inválida da API');
      }
    } catch (error) {
      console.error('Erro ao corrigir texto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível corrigir o texto. Tente novamente mais tarde.",
        variant: "destructive"
      });
    } finally {
      setIsCorrectingText(false);
    }
  };

  return {
    isCorrectingText,
    handleCorrectText
  };
};
