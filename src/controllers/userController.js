import * as UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";

// Obtener todos los usuarios
export const getUsers = async (req, res, next) => {
 try {
   const users = await UserModel.getAllUsers();
   res.json(users);
 } catch (err) {
   next(err);
 }
};

// Obtener usuario por ID
export const getUser = async (req, res, next) => {
 try {
   const { id } = req.params;
   const user = await UserModel.getUserById(id);
   if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
   res.json(user);
 } catch (err) {
   next(err);
 }
};

// Crear usuario
export const createUser = async (req, res, next) => {
 try {
   const { id_person, id_role, ci, password } = req.body;
   if (!id_person || !id_role || !ci || !password)
     return res.status(400).json({ error: "Todos los campos son requeridos" });

   // Validar CI único
   const exists = await UserModel.ciExists(ci);
   if (exists) return res.status(400).json({ error: "CI ya existe" });

   const password_hash = await bcrypt.hash(password, 10);

   const newUser = await UserModel.createUser({ id_person, id_role, ci, password_hash });
   res.status(201).json(newUser);
 } catch (err) {
   next(err);
 }
};

// Actualizar usuario
export const updateUserController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const { id_person, id_role, ci, password, is_active } = req.body;

   if (!id_person || !id_role || !ci || is_active === undefined)
     return res.status(400).json({ error: "Todos los campos requeridos excepto contraseña" });

   let password_hash;
   if (password) password_hash = await bcrypt.hash(password, 10);

   const updatedUser = await UserModel.updateUser(id, { id_person, id_role, ci, password_hash, is_active });
   if (!updatedUser) return res.status(404).json({ error: "Usuario no encontrado" });

   res.json(updatedUser);
 } catch (err) {
   next(err);
 }
};

// Desactivar usuario
export const deactivateUserController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const deactivatedUser = await UserModel.deactivateUser(id);
   if (!deactivatedUser) return res.status(404).json({ error: "Usuario no encontrado" });
   res.json({ message: "Usuario desactivado correctamente", deactivatedUser });
 } catch (err) {
   next(err);
 }
};
