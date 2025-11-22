const db = require("../config/database");

const dashboardController = {
  getMetricasHoy: (req, res) => {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    
    const ayer = new Date(ahora);
    ayer.setDate(ayer.getDate() - 1);
    const ayerStr = ayer.toISOString().split('T')[0];

    const sql = `
      SELECT 
        (SELECT COALESCE(SUM(total), 0) FROM venta WHERE fecha = ?) as totalHoy,
        (SELECT COALESCE(SUM(dv.cantidad), 0) 
         FROM venta v 
         JOIN detalle_venta dv ON v.id_venta = dv.id_venta 
         WHERE v.fecha = ?) as productosHoy,
        (SELECT COUNT(*) FROM venta WHERE fecha = ?) as ventasHoy,
        
        (SELECT COALESCE(SUM(total), 0) FROM venta WHERE fecha = ?) as totalAyer,
        (SELECT COALESCE(SUM(dv.cantidad), 0) 
         FROM venta v 
         JOIN detalle_venta dv ON v.id_venta = dv.id_venta 
         WHERE v.fecha = ?) as productosAyer,
        (SELECT COUNT(*) FROM venta WHERE fecha = ?) as ventasAyer
    `;

    db.get(sql, [hoy, hoy, hoy, ayerStr, ayerStr, ayerStr], (err, row) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: row });
    });
  },

  getProductosStockBajo: (req, res) => {
    const sql = `
      SELECT 
        p.id_producto as id,
        p.nombre_prod as nombre,
        p.stock,
        p.lote,
        p.medida,
        p.presentacion,
        COALESCE(l.nombre_labo, 'Sin laboratorio') as laboratorio,
        CASE 
          WHEN p.stock <= 3 THEN 'Crítico'
          WHEN p.stock <= 10 THEN 'Bajo' 
          ELSE 'Bueno'
        END as estado
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      WHERE p.stock <= 10 AND p.estado = 'activo'
      ORDER BY p.stock ASC
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getProductosPorVencer: (req, res) => {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    
    const sql = `
      SELECT 
        p.id_producto as id,
        p.nombre_prod as nombre,
        p.lote,
        p.medida,
        p.presentacion,
        COALESCE(l.nombre_labo, 'Sin laboratorio') as laboratorio,
        p.fecha_exp as fechaVencimiento,
        JULIANDAY(p.fecha_exp) - JULIANDAY(?) as diasRestantes
      FROM producto p
      LEFT JOIN laboratorio l ON p.id_lab = l.id_lab
      WHERE p.fecha_exp IS NOT NULL 
        AND p.estado = 'activo'
        AND JULIANDAY(p.fecha_exp) - JULIANDAY(?) BETWEEN 0 AND 30
      ORDER BY diasRestantes ASC
    `;

    db.all(sql, [hoy, hoy], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      const productos = rows.map(p => ({
        ...p,
        diasRestantes: Math.ceil(p.diasRestantes)
      }));
      
      res.json({ data: productos });
    });
  },

getVentasMensuales: (req, res) => {
  const sql = `
    SELECT 
      strftime('%Y', fecha) as año,
      strftime('%m', fecha) as mes_numero,
      CASE strftime('%m', fecha)
        WHEN '01' THEN 'Ene' WHEN '02' THEN 'Feb' WHEN '03' THEN 'Mar'
        WHEN '04' THEN 'Abr' WHEN '05' THEN 'May' WHEN '06' THEN 'Jun'
        WHEN '07' THEN 'Jul' WHEN '08' THEN 'Ago' WHEN '09' THEN 'Sep'
        WHEN '10' THEN 'Oct' WHEN '11' THEN 'Nov' WHEN '12' THEN 'Dic'
      END as mes,
      COALESCE(SUM(total), 0) as ventas,
      COALESCE(SUM(
        (SELECT SUM(cantidad) FROM detalle_venta dv WHERE dv.id_venta = v.id_venta)
      ), 0) as productos,
      COUNT(*) as nroVentas
    FROM venta v
    GROUP BY año, mes_numero
    ORDER BY año DESC, mes_numero ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
},


  getTopProductos: (req, res) => {
    const sql = `
      SELECT 
        p.nombre_prod as nombre,
        p.presentacion as categoria,
        COALESCE(SUM(dv.cantidad), 0) as ventas
      FROM producto p
      LEFT JOIN detalle_venta dv ON p.id_producto = dv.id_producto
      LEFT JOIN venta v ON dv.id_venta = v.id_venta
      WHERE v.fecha >= date('now', '-30 days')
      GROUP BY p.id_producto, p.nombre_prod, p.presentacion
      HAVING ventas > 0
      ORDER BY ventas DESC
      LIMIT 15
    `;

    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  }
};

module.exports = dashboardController;