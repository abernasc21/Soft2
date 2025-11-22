const express = require("express");
const router = express.Router();
const proveedoresController = require("../controllers/proveedoresController");

router.get("/", proveedoresController.getAll);
router.get("/:id", proveedoresController.getById);
router.post("/", proveedoresController.create);
router.put("/:id", proveedoresController.update);

module.exports = router;