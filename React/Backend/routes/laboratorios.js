const express = require("express");
const router = express.Router();
const laboratoriosController = require("../controllers/laboratoriosController");

router.get("/", laboratoriosController.getAll);
router.get("/:id", laboratoriosController.getById);
router.post("/", laboratoriosController.create);
router.put("/:id", laboratoriosController.update);
router.delete("/:id", laboratoriosController.delete);

module.exports = router;