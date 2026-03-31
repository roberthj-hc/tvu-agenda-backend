import * as UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  try {
    const { ci, password } = req.body;
    if (!ci) return res.status(400).json({ error: "C.I es requerido" });
    const user = await UserModel.getUserByCI(ci);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    let role = "";
    let redirect = "";

    // USUARIO (no password)
    if (user.id_role === 2) {
      role = "usuario";
      redirect = "/contacts";
    }

    // ADMIN (con password)
    else if (user.id_role === 1) {
      if (!password)
        return res.status(400).json({ error: "Contraseña requerida" });

      // bcrypt
      const validPassword = password === user.password_hash;
      //const validPassword = await bcrypt.compare(password, user.password_hash);

      if (!validPassword)
        return res.status(401).json({ error: "Contraseña incorrecta" });

      role = "admin";
      redirect = "/admin";
    }

    else {
      return res.status(403).json({ error: "Rol no autorizado" });
    }

    const token = jwt.sign(
      {
        id_user: user.id_user,
        name: user.name,
        role_id: user.id_role
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login exitoso",
      token,
      user: {
        id_user: user.id_user,
        name: user.name,
        role_id: user.id_role
      },
      role,
      redirect
    });

  } catch (err) {
    next(err);
  }
};

export const checkCI = async (req, res, next) => {
  try {
    const { ci } = req.body;
    if (!ci) return res.status(400).json({ error: "C.I es requerido" });

    const user = await UserModel.getUserByCI(ci);
    if (!user || !user.is_active) {
      return res.status(401).json({ error: "Usuario no encontrado o inactivo" });
    }

    // Devuelve solo rol y redirect
    if (user.id_role === 2) {
      return res.json({ role: "usuario", redirect: "/contacts" });
    }

    if (user.id_role === 1) {
      return res.json({ role: "admin", redirect: "/admin" });
    }

    return res.status(403).json({ error: "Rol no autorizado" });

  } catch (err) {
    next(err);
  }
};