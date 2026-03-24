import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res, next) => {
  const { ci, password } = req.body;
  if (!ci || !password) return res.status(400).json({ error: "CI y password requeridos" });

  try {
    const userResult = await pool.query(
      "SELECT u.id_user, u.password_hash, u.is_active, r.role FROM users u JOIN role r ON u.id_role=r.id_role WHERE u.ci=$1",
      [ci]
    );

    if (userResult.rows.length === 0) return res.status(401).json({ error: "Usuario no encontrado" });

    const user = userResult.rows[0];
    if (!user.is_active) return res.status(403).json({ error: "Usuario inactivo" });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id_user: user.id_user, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
};
