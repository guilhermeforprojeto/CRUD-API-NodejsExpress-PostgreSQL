const dbConfig = require("../config/db.config");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sacolas = require("./sacolas.js")(sequelize, Sequelize);
db.frenteAss = require("./frenteAss.js")(sequelize, Sequelize);
db.doadores = require("./doadores.js")(sequelize, Sequelize);
db.celula = require("./celulas.js")(sequelize, Sequelize);

module.exports = db;