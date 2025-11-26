const express = require("express");
const cors = require("cors");
const { createTables, verificarProductosAlIniciar } = require("./models/databaseSetup");


// Importar rutas
const clientesRoutes = require("./routes/clientes");

const laboratoriosRoutes = require("./routes/laboratorios");
const productosRoutes = require("./routes/productos");
const ventasRoutes = require("./routes/ventas");

const authRoutes = require("./routes/auth");



const app = express();
app.use(cors());
app.use(express.json());

// Crear tablas al iniciar
createTables();
// verificar tablas al iniciar
verificarProductosAlIniciar()

// Configurar rutas
app.use("/api/clientes", clientesRoutes);

app.use("/api/laboratorios", laboratoriosRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/ventas", ventasRoutes);

app.use("/api/auth", authRoutes);



// Ruta raíz
app.get("/", (req, res) => {
  res.json({ 
    message: "API Farmacia Oasis",
    endpoints: {
      clientes: "/api/clientes",

      laboratorios: "/api/laboratorios",
      productos: "/api/productos",
      ventas: "/api/ventas"
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
  console.log(`Disponible en http://localhost:${PORT}/api/dashboard`);
});