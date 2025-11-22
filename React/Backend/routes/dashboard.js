const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");

router.get("/metricas-hoy", dashboardController.getMetricasHoy);
router.get("/productos-stock-bajo", dashboardController.getProductosStockBajo);
router.get("/productos-por-vencer", dashboardController.getProductosPorVencer);
router.get("/ventas-mensuales", dashboardController.getVentasMensuales);
router.get("/top-productos", dashboardController.getTopProductos);

module.exports = router;