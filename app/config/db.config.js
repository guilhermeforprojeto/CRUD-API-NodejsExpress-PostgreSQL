module.exports = {
  HOST: "127.0.0.1",
  USER: "guilherme",
  PASSWORD: "123456a.",
  DB: "testeapi",
  dialect: "postgres",
  pool: {
    max: 500,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
