const db = require("../config/database");

const proveedoresController = {
  getAll: (req, res) => {
    const sql = "SELECT * FROM proveedor";
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getById: (req, res) => {
    const sql = "SELECT * FROM proveedor WHERE id_proveedor = ?";
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  },

  create: (req, res) => {
    const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
    
    const sql = `INSERT INTO proveedor (nombre, telefono, cantidad, concepto, precio_unitario, precio_total) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        data: { 
          id_proveedor: this.lastID, 
          nombre, 
          telefono, 
          cantidad, 
          concepto, 
          precio_unitario, 
          precio_total
        }
      });
    });
  },

  update: (req, res) => {
    const { nombre, telefono, cantidad, concepto, precio_unitario, precio_total } = req.body;
    
    const sql = `UPDATE proveedor 
                 SET nombre = ?, telefono = ?, cantidad = ?, concepto = ?, 
                     precio_unitario = ?, precio_total = ?
                 WHERE id_proveedor = ?`;
    
    db.run(sql, [nombre, telefono, cantidad, concepto, precio_unitario, precio_total, req.params.id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      db.get("SELECT * FROM proveedor WHERE id_proveedor = ?", [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: row });
      });
    });
  }
};

module.exports = proveedoresController;