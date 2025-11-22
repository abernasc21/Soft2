const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./farmacia.db", (err) => {
  if (err) console.error("Error al conectar BD:", err);
  else console.log("Conectado a SQLite ✅");
});

module.exports = db;