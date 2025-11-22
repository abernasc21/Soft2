const db = require("../config/database");

const ventasController = {
  getAllWithDetails: (req, res) => {
    const sql = `
      SELECT 
        v.id_venta,
        v.fecha,
        v.hora,
        c.nombre AS cliente,
        c.ci_nit,
        v.metodo_pago,
        v.total,
        v.descuento,
        (v.total + COALESCE(v.descuento, 0)) as total_sin_descuento,
        GROUP_CONCAT(p.nombre_prod || ' x' || dv.cantidad, ', ') AS productos
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
      INNER JOIN detalle_venta dv ON dv.id_venta = v.id_venta
      INNER JOIN producto p ON dv.id_producto = p.id_producto
      GROUP BY v.id_venta, v.fecha, v.hora, c.nombre, c.ci_nit, v.metodo_pago, v.total, v.descuento
      ORDER BY v.fecha DESC, v.hora DESC
    `;
    
    db.all(sql, [], (err, rows) => {
      if(err){
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  },

  getVentaDetails: (req, res) => {
    const { id } = req.params;
    
    const sqlVenta = `
      SELECT 
        v.*,
        c.nombre as cliente_nombre,
        c.ci_nit as cliente_ci_nit,
        c.descuento as porcentaje_descuento_cliente
      FROM venta v
      LEFT JOIN cliente c ON v.id_cliente = c.cod_cli
      WHERE v.id_venta = ?
    `;
    
    const sqlDetalles = `
      SELECT 
        dv.*,
        p.nombre_prod,
        p.precio_venta,
        p.presentacion
      FROM detalle_venta dv
      JOIN producto p ON dv.id_producto = p.id_producto
      WHERE dv.id_venta = ?
    `;
    
    db.get(sqlVenta, [id], (err, venta) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      
      db.all(sqlDetalles, [id], (err, detalles) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        
        res.json({
          data: {
            venta,
            detalles
          }
        });
      });
    });
  },

  create: (req, res) => {
    const { cliente, metodo_pago, productos } = req.body;
    
    const totalSinDescuento = productos.reduce((sum, producto) => {
      return sum + (producto.precio * producto.cantidad);
    }, 0);
    
    db.serialize(() => {

      const obtenerDescuentoCliente = (callback) => {
        if (!cliente) {
          callback(null, 0);
          return;
        }
        
        const sqlDescuento = "SELECT descuento FROM cliente WHERE cod_cli = ?";
        db.get(sqlDescuento, [cliente], (err, row) => {
          if (err) {
            callback(err);
            return;
          }
          callback(null, row ? row.descuento : 0);
        });
      };
      
      obtenerDescuentoCliente((err, descuentoCliente) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        
        const descuentoAplicado = totalSinDescuento * (descuentoCliente / 100);
        const totalFinal = totalSinDescuento - descuentoAplicado;
        
        const sqlVenta = `
          INSERT INTO venta (total, metodo_pago, id_cliente, descuento)
          VALUES (?, ?, ?, ?)
        `;
        
        db.run(sqlVenta, [totalFinal, metodo_pago, cliente || null, descuentoAplicado], function(err) {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          
          const ventaId = this.lastID;
          const detalles = [];
          
          const actualizarStockProducto = (productoId, cantidad, callback) => {
            const sqlActualizarStock = `
              UPDATE producto 
              SET stock = stock - ? 
              WHERE id_producto = ? AND estado = 'activo'
            `;
            
            db.run(sqlActualizarStock, [cantidad, productoId], function(err) {
              if (err) {
                callback(err);
                return;
              }
              
              if (this.changes === 0) {
                callback(new Error(`Producto no encontrado o inactivo: ${productoId}`));
                return;
              }
              
              callback(null);
            });
          };
          
          let productosProcesados = 0;
          let errorOcurrido = null;
          
          productos.forEach((producto) => {
            const subtotal = producto.precio * producto.cantidad;
            
            actualizarStockProducto(producto.id, producto.cantidad, (err) => {
              if (err) {
                errorOcurrido = err;
                return;
              }
              
              const sqlDetalle = `
                INSERT INTO detalle_venta (id_venta, id_producto, cantidad, subtotal)
                VALUES (?, ?, ?, ?)
              `;
              
              db.run(sqlDetalle, [ventaId, producto.id, producto.cantidad, subtotal], function(err) {
                if (err) {
                  errorOcurrido = err;
                  return;
                }
                
                detalles.push({
                  id_detalle: this.lastID,
                  id_producto: producto.id,
                  cantidad: producto.cantidad,
                  subtotal: subtotal
                });
                
                productosProcesados++;
                
                if (productosProcesados === productos.length) {
                  if (errorOcurrido) {
                    res.status(400).json({ error: errorOcurrido.message });
                    return;
                  }
                  
                  res.json({
                    data: {
                      id_venta: ventaId,
                      total: totalFinal,
                      total_sin_descuento: totalSinDescuento,
                      descuento_aplicado: descuentoAplicado,
                      porcentaje_descuento: descuentoCliente,
                      metodo_pago,
                      id_cliente: cliente,
                      detalles
                    }
                  });
                }
              });
            });
          });
        });
      });
    });
  },

};

module.exports = ventasController;