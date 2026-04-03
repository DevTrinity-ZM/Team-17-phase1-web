const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "frank",
  host: "localhost",
  port: 5000,
  database: "mometum",
});

module.exports = pool;