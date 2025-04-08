
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { UserFormData } from './UserManagement';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserFormProps {
  initialData?: UserFormData;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
}

interface FormErrors {
  nome: string;
  email: string;
  matricula: string;
  data_nascimento: string;
}

const UserForm: React.FC<UserFormProps> = ({ 
  initialData, 
  onSubmit,
  onCancel
}) => {
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

  // Efeito para verificar se o email já existe quando o usuário digita
  useEffect(() => {
    const checkEmailExists = async () => {
      // Ignorar checks se o email for o mesmo do dado inicial (caso de edição)
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
  }, [formData.email, initialData]);

  // Efeito para verificar se a matrícula já existe quando o usuário digita
  useEffect(() => {
    const checkMatriculaExists = async () => {
      // Ignorar checks se a matrícula for a mesma do dado inicial (caso de edição)
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
  }, [formData.matricula, initialData]);

  // Sincronização em tempo real para verificar mudanças no banco
  useEffect(() => {
    const channel = supabase
      .channel('users-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'users' 
        }, 
        (payload) => {
          // Verificar se a alteração afeta o email ou matrícula sendo inserido
          if (payload.new && !initialData) {
            const newData = payload.new as Record<string, any>;
            if (newData.email === formData.email) {
              setErrors(prev => ({
                ...prev,
                email: 'Este email acabou de ser registrado por outro usuário'
              }));
              toast.error("Este email acabou de ser registrado por outro usuário");
            }
            if (newData.matricula === formData.matricula) {
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
  }, [formData.email, formData.matricula, initialData]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      nome: '',
      email: '',
      matricula: '',
      data_nascimento: ''
    };

    // Validação do nome
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
      valid = false;
    }

    // Validação do email
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
      valid = false;
    }

    // Validação da matrícula
    if (!formData.matricula?.trim()) {
      newErrors.matricula = 'Matrícula é obrigatória';
      valid = false;
    }

    // Validação da data de nascimento
    if (!formData.data_nascimento?.trim()) {
      newErrors.data_nascimento = 'Data de nascimento é obrigatória';
      valid = false;
    } else {
      // Verificar se a data está no formato DD/MM/YYYY
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
    
    // Limpar erro quando o usuário começa a digitar
    if (field === 'nome' || field === 'email' || field === 'matricula' || field === 'data_nascimento') {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const formatDateInput = (input: string) => {
    // Remove caracteres não numéricos
    const numbers = input.replace(/\D/g, '');
    
    // Formatação para DD/MM/YYYY
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    } else {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4, 8)}`;
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDateInput(e.target.value);
    handleChange('data_nascimento', formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm() && !isEmailChecking && !isMatriculaChecking) {
      onSubmit(formData);
    } else if (isEmailChecking || isMatriculaChecking) {
      toast.warning("Aguarde a verificação de dados...");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome</Label>
        <Input
          id="nome"
          value={formData.nome}
          onChange={(e) => handleChange('nome', e.target.value)}
          placeholder="Nome completo"
        />
        {errors.nome && (
          <p className="text-sm text-red-500">{errors.nome}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="email@example.com"
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
        {isEmailChecking && (
          <p className="text-sm text-blue-500">Verificando email...</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="matricula">Matrícula</Label>
        <Input
          id="matricula"
          value={formData.matricula}
          onChange={(e) => handleChange('matricula', e.target.value)}
          placeholder="Número de matrícula"
        />
        {errors.matricula && (
          <p className="text-sm text-red-500">{errors.matricula}</p>
        )}
        {isMatriculaChecking && (
          <p className="text-sm text-blue-500">Verificando matrícula...</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_nascimento">Data de Nascimento</Label>
        <Input
          id="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleDateChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
        />
        {errors.data_nascimento && (
          <p className="text-sm text-red-500">{errors.data_nascimento}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="perfil">Perfil</Label>
        <Select
          value={formData.perfil}
          onValueChange={(value) => handleChange('perfil', value)}
        >
          <SelectTrigger id="perfil">
            <SelectValue placeholder="Selecione um perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inspetor">Inspetor</SelectItem>
            <SelectItem value="Subinspetor">Subinspetor</SelectItem>
            <SelectItem value="Supervisor">Supervisor</SelectItem>
            <SelectItem value="Corregedor">Corregedor</SelectItem>
            <SelectItem value="Agente">Agente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="status"
          checked={formData.status}
          onCheckedChange={(checked) => handleChange('status', checked)}
        />
        <Label htmlFor="status">Usuário ativo</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialData ? 'Salvar' : 'Criar Usuário'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
