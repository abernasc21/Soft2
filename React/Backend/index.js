const express = require("express");
const cors = require("cors");
const { createTables, verificarProductosAlIniciar } = require("./models/databaseSetup");


// Importar rutas
const clientesRoutes = require("./routes/clientes");
const proveedoresRoutes = require("./routes/proveedores");
const laboratoriosRoutes = require("./routes/laboratorios");
const productosRoutes = require("./routes/productos");
const ventasRoutes = require("./routes/ventas");
const dashboardRoutes = require("./routes/dashboard");

const historialRoutes = require("./routes/historial");

const app = express();
app.use(cors());
app.use(express.json());

// Crear tablas al iniciar
createTables();
// verificar tablas al iniciar
verificarProductosAlIniciar()

// Configurar rutas
app.use("/api/clientes", clientesRoutes);
app.use("/api/proveedores", proveedoresRoutes);
app.use("/api/laboratorios", laboratoriosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/historial", historialRoutes); 

// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "API Farmacia Oasis",
    endpoints: {
      clientes: "/api/clientes",
      proveedores: "/api/proveedores",
      laboratorios: "/api/laboratorios",
      productos: "/api/productos",
      ventas: "/api/ventas",
      dashboard: "/api/dashboard",

      historial: "/api/historial" 
    }
  });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint no encontrado" });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Dashboard disponible en http://localhost:${PORT}/api/dashboard`);
});