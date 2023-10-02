module.exports = (sequelize, Sequelize) => {
  const doadores = sequelize.define("doadores", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    nome: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    contato: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        format: {
          value: /\S+@\S+\.\S+/,
          message: "O campo 'contato' deve ser um e-mail válido",
        },
      },
    },
    sacolinhas: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false,
    },
    obs: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    timestamps: true,
  });

  return doadores;
};
