module.exports = (sequelize, Sequelize) => {
  const Celula = sequelize.define("celulas", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nomeLider: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contatoLider: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    obs: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  }, {
    timestamps: true,
  });


  return Celula;
};