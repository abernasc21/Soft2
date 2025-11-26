const db = require("../config/database");

const authController = {
  login: (req, res) => {
    const { username, password } = req.body;

    const sql = "SELECT * FROM usuario WHERE username = ? AND password = ?";
    db.get(sql, [username, password], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (!row) return res.status(401).json({ error: "Credenciales incorrectas" });

      return res.json({
        message: "Acceso permitido",
        user: {
          id_usuario: row.id_usuario,
          username: row.username
        }
      });
    });
  }
};

module.exports = authController;
