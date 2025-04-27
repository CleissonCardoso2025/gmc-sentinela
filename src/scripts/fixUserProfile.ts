import { updateUserProfile } from '../services/userService/updateUserProfile';

// Função para atualizar o perfil do usuário cleissoncardoso@gmail.com para "Inspetor"
updateUserProfile('cleissoncardoso@gmail.com', 'Inspetor')
  .then(result => {
    console.log('Resultado da atualização:', result);
    console.log('Se "true", o perfil foi atualizado com sucesso para "Inspetor"');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro ao atualizar perfil:', error);
    process.exit(1);
  });
