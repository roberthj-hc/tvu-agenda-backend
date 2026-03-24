import pool from "../config/db.js";

// Obtener todas las personas activas
export const getAllPersons = async () => {
 const result = await pool.query("SELECT * FROM person ORDER BY id_person");
 return result.rows;
};

// Obtener persona por ID
export const getPersonById = async (id_person) => {
 const result = await pool.query("SELECT * FROM person WHERE id_person=$1", [id_person]);
 return result.rows[0];
};

// Crear una persona
export const createPerson = async ({ name, last_name_1, last_name_2 }) => {
 const result = await pool.query(
   "INSERT INTO person (name, last_name_1, last_name_2, is_active) VALUES ($1,$2,$3,TRUE) RETURNING *",
   [name, last_name_1, last_name_2]
 );
 return result.rows[0];
};

// Actualizar persona
export const updatePerson = async (id_person, { name, last_name_1, last_name_2, is_active }) => {
 const result = await pool.query(
   "UPDATE person SET name=$1, last_name_1=$2, last_name_2=$3, is_active=$4 WHERE id_person=$5 RETURNING *",
   [name, last_name_1, last_name_2, is_active, id_person]
 );
 return result.rows[0];
};

// Soft delete de persona (is_active = false)
export const deactivatePerson = async (id_person) => {
 const result = await pool.query(
   "UPDATE person SET is_active=FALSE WHERE id_person=$1 RETURNING *",
   [id_person]
 );
 return result.rows[0];
};
