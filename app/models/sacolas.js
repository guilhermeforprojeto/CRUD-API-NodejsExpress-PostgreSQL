module.exports = (sequelize, Sequelize) => {
  const Sacolas = sequelize.define("sacolas", {
    codigo: {
      type: Sequelize.STRING,
      unique: true, // Defina como único se o código deve ser único
    },
    nome: {
      type: Sequelize.STRING,
    },
    conteudo: {
      type: Sequelize.STRING,
    },
    assistenteSocialId: {
      type: Sequelize.STRING,
    },
    frenteAssistidaId: {
      type: Sequelize.STRING,
    },
    assistidoId: {
      type: Sequelize.STRING,
    },
    doadorId: {
      type: Sequelize.STRING,
    },
  });

  return Sacolas;
};
