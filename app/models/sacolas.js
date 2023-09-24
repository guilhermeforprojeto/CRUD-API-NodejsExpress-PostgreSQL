module.exports = (sequelize, Sequelize) => {
  const Sacolas = sequelize.define("sacolas", {
    codigo: {
      type: Sequelize.STRING,
      unique: true, // Defina como único se o código deve ser único
    },
    status: {
      type: Sequelize.STRING,
    },
    nome: {
      type: Sequelize.STRING,
    },
    assistentesocial: {
      type: Sequelize.STRING,
    },
    nomefrenteassistida: {
      type: Sequelize.STRING,
    },
    assistido: {
      type: Sequelize.STRING,
    },
    doador: {
      type: Sequelize.STRING,
    },
    obs: {
      type: Sequelize.STRING,
    },
  });

  return Sacolas;
};
