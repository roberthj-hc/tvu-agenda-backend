import pool from "../config/db.js";

// Obtener todos los usuarios
export const getAllUsers = async () => {
 const result = await pool.query(
   `SELECT u.id_user, u.ci, u.is_active, u.created_at,
           p.name, p.last_name_1, p.last_name_2,
           r.role
    FROM users u
    JOIN person p ON u.id_person=p.id_person
    JOIN role r ON u.id_role=r.id_role
    ORDER BY u.id_user`
 );
 return result.rows;
};

// Obtener usuario por ID
export const getUserById = async (id_user) => {
 const result = await pool.query(
   `SELECT u.id_user, u.ci, u.is_active, u.created_at,
           p.name, p.last_name_1, p.last_name_2,
           r.role
    FROM users u
    JOIN person p ON u.id_person=p.id_person
    JOIN role r ON u.id_role=r.id_role
    WHERE u.id_user=$1`,
   [id_user]
 );
 return result.rows[0];
};

// Obtener usuario por CI (para login)
export const getUserByCI = async (ci) => {
 const result = await pool.query(
   "SELECT * FROM users WHERE ci=$1",
   [ci]
 );
 return result.rows[0];
};

// Crear usuario
export const createUser = async ({ id_person, id_role, ci, password_hash }) => {
 const result = await pool.query(
   `INSERT INTO users (id_person, id_role, ci, password_hash, is_active, created_at)
    VALUES ($1,$2,$3,$4,TRUE,NOW()) RETURNING *`,
   [id_person, id_role, ci, password_hash]
 );
 return result.rows[0];
};

// Actualizar usuario
export const updateUser = async (id_user, { id_person, id_role, ci, password_hash, is_active }) => {
 let query, values;

 if (password_hash) {
   query = `UPDATE users SET id_person=$1, id_role=$2, ci=$3, password_hash=$4, is_active=$5 WHERE id_user=$6 RETURNING *`;
   values = [id_person, id_role, ci, password_hash, is_active, id_user];
 } else {
   query = `UPDATE users SET id_person=$1, id_role=$2, ci=$3, is_active=$4 WHERE id_user=$5 RETURNING *`;
   values = [id_person, id_role, ci, is_active, id_user];
 }

 const result = await pool.query(query, values);
 return result.rows[0];
};

// Soft delete de usuario (is_active = false)
export const deactivateUser = async (id_user) => {
 const result = await pool.query(
   "UPDATE users SET is_active=FALSE WHERE id_user=$1 RETURNING *",
   [id_user]
 );
 return result.rows[0];
};

// Validar si CI ya existe
export const ciExists = async (ci) => {
 const result = await pool.query("SELECT * FROM users WHERE ci=$1", [ci]);
 return result.rows.length > 0;
};
