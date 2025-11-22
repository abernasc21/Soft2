const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");


router.get("/", ventasController.getAllWithDetails);


router.get("/:id", ventasController.getVentaDetails);
router.post("/", ventasController.create);


module.exports = router;