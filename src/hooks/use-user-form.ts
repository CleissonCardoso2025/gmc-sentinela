
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { UserFormData } from '@/components/Configuracoes/UserManagement';
import { isValid, parse } from "date-fns";

interface FormErrors {
  nome: string;
  email: string;
  matricula: string;
  data_nascimento: string;
}

type RealtimeChangePayload = {
  new: Record<string, any>;
  old: Record<string, any> | null;
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
};

export const useUserForm = (initialData?: UserFormData, readOnly: boolean = false) => {
  const [formData, setFormData] = useState<UserFormData>(
    initialData || {
      nome: '',
      email: '',
      matricula: '',
      data_nascimento: '',
      perfil: 'Agente',
      status: true
    }
  );
  
  const [errors, setErrors] = useState<FormErrors>({
    nome: '',
    email: '',
    matricula: '',
    data_nascimento: ''
  });

  const [isEmailChecking, setIsEmailChecking] = useState(false);
  const [isMatriculaChecking, setIsMatriculaChecking] = useState(false);

  // Email verification
  useEffect(() => {
    if (readOnly) return;
    
    const checkEmailExists = async () => {
      if (initialData && initialData.email === formData.email) {
        return;
      }

      if (formData.email && !errors.email) {
        setIsEmailChecking(true);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('email', formData.email)
            .maybeSingle();

          if (error) throw error;
          
          if (data) {
            setErrors(prev => ({
              ...prev,
              email: 'Este email já está em uso'
            }));
          }
        } catch (error) {
          console.error('Erro ao verificar email:', error);
        } finally {
          setIsEmailChecking(false);
        }
      }
    };

    const debounce = setTimeout(checkEmailExists, 500);
    return () => clearTimeout(debounce);
  }, [formData.email, initialData, readOnly, errors.email]);

  // Matricula verification
  useEffect(() => {
    if (readOnly) return;
    
    const checkMatriculaExists = async () => {
      if (initialData && initialData.matricula === formData.matricula) {
        return;
      }

      if (formData.matricula && !errors.matricula) {
        setIsMatriculaChecking(true);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('matricula', formData.matricula)
            .maybeSingle();

          if (error) throw error;
          
          if (data) {
            setErrors(prev => ({
              ...prev,
              matricula: 'Esta matrícula já está em uso'
            }));
          }
        } catch (error) {
          console.error('Erro ao verificar matrícula:', error);
        } finally {
          setIsMatriculaChecking(false);
        }
      }
    };

    const debounce = setTimeout(checkMatriculaExists, 500);
    return () => clearTimeout(debounce);
  }, [formData.matricula, initialData, readOnly, errors.matricula]);

  // Real-time checks for concurrent users
  useEffect(() => {
    if (readOnly) return;
    
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload: any) => {
          const typedPayload = payload as unknown as RealtimeChangePayload;
          
          if (typedPayload.new && !initialData) {
            if (typedPayload.new.email === formData.email) {
              setErrors(prev => ({
                ...prev,
                email: 'Este email acabou de ser registrado por outro usuário'
              }));
              toast.error("Este email acabou de ser registrado por outro usuário");
            }
            if (typedPayload.new.matricula === formData.matricula) {
              setErrors(prev => ({
                ...prev,
                matricula: 'Esta matrícula acabou de ser registrada por outro usuário'
              }));
              toast.error("Esta matrícula acabou de ser registrada por outro usuário");
            }
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formData.email, formData.matricula, initialData, readOnly]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      nome: '',
      email: '',
      matricula: '',
      data_nascimento: ''
    };

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    if (!formData.matricula?.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
      valid = false;
    }

    if (!formData.data_nascimento?.trim()) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
      valid = false;
    } else {
      const parsedDate = parse(formData.data_nascimento, 'dd/MM/yyyy', new Date());
      if (!isValid(parsedDate)) {
        newErrors.data_nascimento = 'Data inválida. Use o formato DD/MM/YYYY';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'nome' || field === 'email' || field === 'matricula' || field === 'data_nascimento') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return {
    formData,
    errors,
    isEmailChecking,
    isMatriculaChecking,
    validateForm,
    handleChange,
    setErrors
  };
};
