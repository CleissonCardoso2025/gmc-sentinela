import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profile, setProfile] = useState('Inspetor');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Basic authentication check (replace with your actual authentication logic)
      if (username && password) {
        // Get user data from Supabase based on the entered username (email)
        const { data: users, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', username);

        if (error) {
          console.error("Error fetching user:", error);
          toast.error("Erro ao fazer login. Verifique suas credenciais.");
          setLoading(false);
          return;
        }

        if (users && users.length > 0) {
          const user = users[0];

          // For now, just check if the user exists.  Add password check later.
          // In a real app, you'd hash and salt passwords properly.
          if (user) {
            // Store user profile and authentication status in localStorage
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userProfile', user.perfil);
            localStorage.setItem('userName', user.nome);

            toast.success(`Login realizado com sucesso como ${user.nome}!`);

            // Redirect based on user profile
            if (user.perfil === 'Inspetor') {
              navigate('/index');
            } else {
              navigate('/dashboard');
            }
          } else {
            toast.error("Credenciais inválidas. Por favor, tente novamente.");
          }
        } else {
          toast.error("Usuário não encontrado. Verifique suas credenciais.");
        }
      } else {
        toast.error("Por favor, preencha todos os campos.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-md p-6 bg-zinc-800 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img src="/lovable-uploads/d563df95-6038-43c8-80a6-882d66215f63.png" alt="Logo GCM" className="h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Login GCM Sentinela</h1>
          <p className="text-zinc-400 mt-2">Informe suas credenciais para acessar o sistema</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Label htmlFor="username" className="text-white">Usuário (Email)</Label>
            <Input
              type="email"
              id="username"
              placeholder="seu.email@exemplo.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white">Senha</Label>
            <Input
              type="password"
              id="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="profile" className="text-white">Perfil</Label>
            <Select value={profile} onValueChange={setProfile}>
              <SelectTrigger id="profile">
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
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-zinc-400">
            Não possui uma conta?{' '}
            <Button variant="link" className="p-0 text-blue-500" onClick={() => navigate('/register')}>
              Cadastre-se
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
