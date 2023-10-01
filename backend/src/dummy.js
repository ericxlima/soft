const { User, Room } = require('./models');

const init = async () => {
  try {
    console.log("Inicializando o banco de dados...");

    // Criando usuários
    const adminUser = await User.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        password: 'adminpassword', // Em uma situação real, este seria um hash
        is_adm: true
      }
    });

    const regularUser = await User.findOrCreate({
      where: { username: 'user' },
      defaults: {
        password: 'userpassword', // Novamente, isto seria um hash em uma situação real
        is_adm: false
      }
    });

    // Criando salas
    for (let i = 1; i <= 5; i++) {
      await Room.findOrCreate({
        where: { name: `Sala ${i}` },
        defaults: {
          capacity: 10 * i, // Exemplo: a capacidade aumenta de 10 em 10
          status: 'AVAILABLE'
        }
      });
    }

    console.log("Inicialização concluída!");
  } catch (error) {
    console.error("Erro durante a inicialização:", error);
  }
}

// Execute a função de inicialização
init();
