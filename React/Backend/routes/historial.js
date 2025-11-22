//Backend/routes/historial.js
const express = require("express");
const router = express.Router();
const historialController = require("../controllers/historialController");

// Rutas SOLO LECTURA para historial de ingresos/egresos
router.get("/ingresos-egresos", historialController.getAll);
router.get("/ingresos-egresos/por-fecha", historialController.getByDateRange);
router.get("/ingresos-egresos/estadisticas", historialController.getEstadisticas);
router.get("/ingresos-egresos/producto/:nombreProducto", historialController.getByProduct);

module.exports = router;