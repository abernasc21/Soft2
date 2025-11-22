//Backend/historialController.js
const db = require("../config/database");

const historialController = {
  /**
   * Obtener todo el historial de ingresos/egresos
   * GET /api/historial/ingresos-egresos
   */
  getAll: (req, res) => {
    const sql = `
      SELECT 
        id_hie as id,
        id_producto,
        nombre,
        presentacion,
        medida,
        lote,
        precio_venta,
        stock_antiguo,
        stock_nuevo,
        fecha,
        hora,
        laboratorio,
        CASE 
          WHEN stock_nuevo > stock_antiguo THEN 'ingreso'
          WHEN stock_nuevo < stock_antiguo THEN 'egreso'
          ELSE 'ajuste'
        END as tipo
      FROM Historial_Ingresos_Egresos 
      ORDER BY fecha DESC, hora DESC
      LIMIT 1000
    `;
    
    db.all(sql, [], (err, rows) => {
      if (err) {
        console.error('Error en BD:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      
      console.log(`${rows.length} movimientos encontrados`);
      res.json({ 
        data: rows,
        total: rows.length
      });
    });
  },

  /**
   * Obtener historial filtrado por rango de fechas
   * GET /api/historial/ingresos-egresos/por-fecha?fechaInicio=...&fechaFin=...
   */
  getByDateRange: (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      res.status(400).json({ error: 'fechaInicio y fechaFin son requeridos' });
      return;
    }
    
    const sql = `
      SELECT 
        id_hie as id,
        id_producto,
        nombre,
        presentacion,
        lote,
        precio_venta,
        stock_antiguo,
        stock_nuevo,
        fecha,
        hora,
        laboratorio,
        CASE 
          WHEN stock_nuevo > stock_antiguo THEN 'ingreso'
          WHEN stock_nuevo < stock_antiguo THEN 'egreso'
          ELSE 'ajuste'
        END as tipo
      FROM Historial_Ingresos_Egresos 
      WHERE fecha BETWEEN ? AND ?
      ORDER BY fecha DESC, hora DESC
    `;
    
    db.all(sql, [fechaInicio, fechaFin], (err, rows) => {
      if (err) {
        console.error('Error en BD:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      
      console.log(`${rows.length} movimientos encontrados para ${fechaInicio} - ${fechaFin}`);
      res.json({ 
        data: rows,
        total: rows.length
      });
    });
  },

  /**
   * Obtener movimientos por producto
   * GET /api/historial/ingresos-egresos/producto/:nombreProducto
   */
  getByProduct: (req, res) => {
    const { nombreProducto } = req.params;
    
    const sql = `
      SELECT 
        id_hie as id,
        id_producto,
        nombre,
        presentacion,
        lote,
        precio_venta,
        stock_antiguo,
        stock_nuevo,
        fecha,
        hora,
        laboratorio,
        CASE 
          WHEN stock_nuevo > stock_antiguo THEN 'ingreso'
          WHEN stock_nuevo < stock_antiguo THEN 'egreso'
          ELSE 'ajuste'
        END as tipo
      FROM Historial_Ingresos_Egresos 
      WHERE nombre LIKE ?
      ORDER BY fecha DESC, hora DESC
    `;
    
    db.all(sql, [`%${nombreProducto}%`], (err, rows) => {
      if (err) {
        console.error('Error en BD:', err);
        res.status(400).json({ error: err.message });
        return;
      }
      
      console.log(`${rows.length} movimientos encontrados para producto: ${nombreProducto}`);
      res.json({ 
        data: rows,
        total: rows.length
      });
    });
  },

  /**
   * Obtener estadísticas básicas del historial
   * GET /api/historial/ingresos-egresos/estadisticas
   */
  getEstadisticas: (req, res) => {
    const { fechaInicio, fechaFin } = req.query;
    
    let whereClause = '';
    const params = [];
    
    if (fechaInicio && fechaFin) {
      whereClause = ' WHERE fecha BETWEEN ? AND ?';
      params.push(fechaInicio, fechaFin);
    }
    
    const sql = `
      SELECT 
        COUNT(*) as totalMovimientos,
        COUNT(CASE WHEN stock_nuevo > stock_antiguo THEN 1 END) as totalIngresos,
        COUNT(CASE WHEN stock_nuevo < stock_antiguo THEN 1 END) as totalEgresos,
        COUNT(DISTINCT nombre) as productosUnicos,
        COUNT(DISTINCT laboratorio) as laboratoriosUnicos
      FROM Historial_Ingresos_Egresos
      ${whereClause}
    `;
    
    db.get(sql, params, (err, row) => {
      if (err) {
        console.error('Error en BD:', err);
        res.status(400).json({ error: err.message });
        return;
      }
    });
  }
};

module.exports = historialController;