const db = require("../config/database");

const clientesController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM cliente";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getById: (req, res) => {
    const sql = "SELECT * FROM cliente WHERE cod_cli = ?";
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  },

  create: (req, res) => {
    const { nombre, ci_nit, descuento } = req.body;
    const estado = 'activo';
    
    const sql = `INSERT INTO cliente (nombre, ci_nit, descuento, estado) 
                 VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [nombre, ci_nit, descuento, estado], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        data: { 
          cod_cli: this.lastID, 
          nombre, 
          ci_nit, 
          descuento, 
          estado 
        }
      });
    });
  },

  update: (req, res) => {
    const { nombre, ci_nit, descuento, estado } = req.body;
    
    const sql = `UPDATE cliente 
                 SET nombre = ?, ci_nit = ?, descuento = ?, estado = ? 
                 WHERE cod_cli = ?`;
    
    db.run(sql, [nombre, ci_nit, descuento, estado, req.params.id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      db.get("SELECT * FROM cliente WHERE cod_cli = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: row });
      });
    });
  },

  delete: (req, res) => {
    const sql = "UPDATE cliente SET estado = 'inactivo' WHERE cod_cli = ?";
    
    db.run(sql, [req.params.id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ 
        data: { 
          message: 'Cliente desactivado correctamente',
          changes: this.changes 
        } 
      });
    });
  }
};

module.exports = clientesController;