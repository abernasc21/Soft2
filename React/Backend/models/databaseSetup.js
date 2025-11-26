
const db = require("../config/database");

const createTables = () => {
  // USUARIOS
  db.run(`CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
  db.get("SELECT * FROM usuario LIMIT 1", (err, row) => {
    if (!row) {
      db.run("INSERT INTO usuario (username, password) VALUES (?, ?)", 
        ["admin", "1234"]);
      console.log("👤 Usuario por defecto creado: admin / 1234");
    }
  });
  

  // LABORATORIO
  db.run(`CREATE TABLE IF NOT EXISTS laboratorio (
    id_lab INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_labo TEXT,
    direccion TEXT
  )`);


  // CLIENTE
  db.run(`CREATE TABLE IF NOT EXISTS cliente (
    cod_cli INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    ci_nit TEXT,
    descuento REAL,
    estado TEXT
  )`);

  // PRODUCTO
  db.run(`CREATE TABLE IF NOT EXISTS producto (
    id_producto INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_prod TEXT,
    lote TEXT,
    fecha_exp DATE,
    porcentaje_g REAL,
    stock INTEGER,
    presentacion TEXT,
    precio_venta REAL,
    precio_compra REAL,
    medida TEXT,
    estado TEXT,
    id_lab INTEGER,
    FOREIGN KEY (id_lab) REFERENCES laboratorio(id_lab)
  )`);

  // VENTA
  db.run(`CREATE TABLE IF NOT EXISTS venta (
    id_venta INTEGER PRIMARY KEY AUTOINCREMENT,
    fecha DATE DEFAULT (DATE('now','localtime')),
    hora TIME DEFAULT (TIME('now','localtime')),
    total REAL,
    metodo_pago TEXT,
    id_cliente INTEGER,
    descuento REAL,
    FOREIGN KEY (id_cliente) REFERENCES cliente(cod_cli)
  )`);

  // DETALLE_VENTA
  db.run(`CREATE TABLE IF NOT EXISTS detalle_venta (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT,
    id_venta INTEGER,
    id_producto INTEGER,
    cantidad INTEGER,
    descuento REAL,
    subtotal REAL,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
  )`);


  // TRIGGERS
  db.serialize(() => {
    //  TRIGGER PARA DESACTIVAR PRODUCTO CUANDO STOCK = 0
    db.run(`CREATE TRIGGER IF NOT EXISTS desactivar_producto_stock_cero
      AFTER UPDATE ON producto
      FOR EACH ROW
      WHEN NEW.stock = 0 AND OLD.stock > 0 AND NEW.estado = 'activo'
      BEGIN
        UPDATE producto 
        SET estado = 'desactivado' 
        WHERE id_producto = NEW.id_producto;
      END;
    `);
  });
};

//FUNCIONES

const verificarProductosAlIniciar = () => {
  console.log('🔍 Verificando productos al iniciar servidor...');
  
  const sqlStockCero = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE stock = 0 AND estado = 'activo'
  `;
  
  db.run(sqlStockCero);
  
  const sqlVencidos = `
    UPDATE producto 
    SET estado = 'desactivado' 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) < DATE('now','localtime') 
      AND estado = 'activo'
  `;
  
  db.run(sqlVencidos);
  
  const sqlProximosVencer = `
    SELECT COUNT(*) as count
    FROM producto 
    WHERE fecha_exp IS NOT NULL 
      AND DATE(fecha_exp) BETWEEN DATE('now','localtime') AND DATE('now','localtime','+30 days')
      AND estado = 'activo'
  `;
  
  db.get(sqlProximosVencer);
};

module.exports = { createTables, verificarProductosAlIniciar };