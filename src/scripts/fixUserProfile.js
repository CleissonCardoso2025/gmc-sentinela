// Script para atualizar o perfil do usuário cleissoncardoso@gmail.com para "Inspetor"
const { createClient } = require('@supabase/supabase-js');

// Obter as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Criar cliente Supabase com as mesmas credenciais usadas no projeto
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: Variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateUserProfile(email, newProfile) {
  try {
    console.log(`Tentando atualizar perfil para email: ${email} para perfil: ${newProfile}`);
    
    // Primeiro, encontrar o usuário pelo email
    const { data: userByEmail, error: searchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (searchError) {
      console.error("Erro ao buscar usuário pelo email:", searchError);
      return false;
    }

    // Se o usuário existe, atualizar o perfil
    if (userByEmail) {
      console.log(`Usuário encontrado: ${userByEmail.nome}, perfil atual: ${userByEmail.perfil}`);
      
      const { error: updateError } = await supabase
        .from('users')
        .update({ perfil: newProfile })
        .eq('email', email);

      if (updateError) {
        console.error("Erro ao atualizar usuário:", updateError);
        return false;
      }

      console.log(`Perfil atualizado com sucesso para ${newProfile}`);
      return true;
    }

    // Se o usuário não existe, criar um novo
    console.log(`Usuário não encontrado, criando novo usuário com email ${email}`);
    
    const { error: createError } = await supabase
      .from('users')
      .insert([{ 
        email: email, 
        perfil: newProfile,
        nome: email.split('@')[0], // Usando parte do email como nome
        status: true
      }]);

    if (createError) {
      console.error("Erro ao criar usuário:", createError);
      return false;
    }

    console.log(`Novo usuário criado para ${email} com perfil ${newProfile}`);
    return true;
    
  } catch (error) {
    console.error("Exceção em updateUserProfile:", error);
    return false;
  }
}

// Executar a função para atualizar o perfil
updateUserProfile('cleissoncardoso@gmail.com', 'Inspetor')
  .then(result => {
    console.log('Resultado da atualização:', result);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Erro:', error);
    process.exit(1);
  });
