const db = require("../config/database");

const productosController = {
  getAll: (req, res) => {
    const sql = `
      SELECT 
        p.*,
        l.nombre_labo as laboratorio_nombre
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
    `;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getById: (req, res) => {
    const sql = `
      SELECT 
        p.*,
        l.nombre_labo as laboratorio_nombre
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      WHERE p.id_producto = ?
    `;
    db.get(sql, [req.params.id], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  },

  create: (req, res) => {
    const {
      nombre_prod,
      lote,
      fecha_exp,
      porcentaje_g,
      stock,
      presentacion,
      precio_venta,
      precio_compra,
      medida,
      id_lab,
      
    } = req.body;
    
    const estado = 'activo';
    
    const sql = `
      INSERT INTO producto (
        nombre_prod, lote, fecha_exp, porcentaje_g, stock, 
        presentacion, precio_venta, precio_compra, medida, 
        estado, id_lab
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(sql, [
      nombre_prod, lote, fecha_exp, porcentaje_g, stock,
      presentacion, precio_venta, precio_compra, medida,
      estado, id_lab
    ], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        data: { 
          id_producto: this.lastID,
          nombre_prod, lote, fecha_exp, porcentaje_g, stock,
          presentacion, precio_venta, precio_compra, medida,
          estado, id_lab
        }
      });
    });
  },

  update: (req, res) => {
    const {
      nombre_prod,
      lote,
      fecha_exp,
      porcentaje_g,
      stock,
      presentacion,
      precio_venta,
      precio_compra,
      medida,
      estado,
      id_lab,
    } = req.body;
    
    const sql = `
      UPDATE producto 
      SET 
        nombre_prod = ?, lote = ?, fecha_exp = ?, porcentaje_g = ?, 
        stock = ?, presentacion = ?, precio_venta = ?, precio_compra = ?, 
        medida = ?, estado = ?, id_lab = ?
      WHERE id_producto = ?
    `;
    
    db.run(sql, [
      nombre_prod, lote, fecha_exp, porcentaje_g, stock,
      presentacion, precio_venta, precio_compra, medida,
      estado, id_lab, req.params.id
    ], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      db.get(`
        SELECT 
          p.*,
          l.nombre_labo as laboratorio_nombre
        FROM producto p
        LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
        WHERE p.id_producto = ?
      `, [req.params.id], (err, row) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({ data: row });
      });
    });
  },

  delete: (req, res) => {
    const sql = "UPDATE producto SET estado = 'desactivado' WHERE id_producto = ?";
    
    db.run(sql, [req.params.id], function(err) {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ 
        data: { 
          message: 'Producto desactivado correctamente',
          changes: this.changes 
        } 
      });
    });
  },

  search: (req, res) => {
    const { query } = req.query;
    
    const sql = `
      SELECT 
        p.*,
        l.nombre_labo as laboratorio_nombre
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      WHERE p.nombre_prod LIKE ? AND p.estado = 'activo'
      ORDER BY p.nombre_prod
      LIMIT 10
    `;
    
    db.all(sql, [`%${query}%`], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  }
};

module.exports = productosController;