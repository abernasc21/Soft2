const db = require("../config/database");

const laboratoriosController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM laboratorio";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getById: (req, res) => {
    const sql = "SELECT * FROM laboratorio WHERE id_lab = ?";
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  },

  create: (req, res) => {
    const { nombre_labo, direccion } = req.body;

    if (!nombre_labo || !direccion) {
      res.status(400).json({ error: "Todos los campos son obligatorios" });
      return;
    }

    const sql = `INSERT INTO laboratorio (nombre_labo, direccion)
                 VALUES (?, ?)`;

    db.run(sql, [nombre_labo, direccion], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        data: {
          id_lab: this.lastID,
          nombre_labo,
          direccion,
        },
      });
    });
  },

  update: (req, res) => {
    const { nombre_labo, direccion } = req.body;

    const sql = `UPDATE laboratorio 
                 SET nombre_labo = ?, direccion = ?
                 WHERE id_lab = ?`;

    db.run(sql, [nombre_labo, direccion, req.params.id], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      db.get("SELECT * FROM laboratorio WHERE id_lab = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: row });
      });
    });
  },

  delete: (req, res) => {
    const sql = "DELETE FROM laboratorio WHERE id_lab = ?";

    db.run(sql, [req.params.id], function (err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }

      res.json({
        data: {
          message: "Laboratorio eliminado correctamente",
          changes: this.changes,
        },
      });
    });
  }
};

module.exports = laboratoriosController;