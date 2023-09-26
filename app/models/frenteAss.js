module.exports = (sequelize, Sequelize) => {
  const frenteAss = sequelize.define("frente-assistida", {
    nome: {
      type: Sequelize.STRING,
      unique: {
        name: 'nome_unique',
        msg: 'Nome da Frente Assistida já existe.',
        fields: [sequelize.fn('lower', sequelize.col('nome'))],
      },
      allowNull: false,
    },
    assistidos: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
  });

  return frenteAss;
};