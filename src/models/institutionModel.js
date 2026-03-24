import pool from "../config/db.js";

// Obtener todas las instituciones
export const getAllInstitutions = async () => {
 const result = await pool.query(
   "SELECT * FROM institution ORDER BY id_institution"
 );
 return result.rows;
};

// Obtener institución por ID
export const getInstitutionById = async (id_institution) => {
 const result = await pool.query(
   "SELECT * FROM institution WHERE id_institution=$1",
   [id_institution]
 );
 return result.rows[0];
};

// Crear institución
export const createInstitution = async ({ institution_name, address }) => {
 const result = await pool.query(
   "INSERT INTO institution (institution_name, address) VALUES ($1, $2) RETURNING *",
   [institution_name, address]
 );
 return result.rows[0];
};

// Actualizar institución
export const updateInstitution = async (id_institution, { institution_name, address }) => {
 const result = await pool.query(
   "UPDATE institution SET institution_name=$1, address=$2 WHERE id_institution=$3 RETURNING *",
   [institution_name, address, id_institution]
 );
 return result.rows[0];
};

// Eliminar institución
export const deleteInstitution = async (id_institution) => {
 const result = await pool.query(
   "DELETE FROM institution WHERE id_institution=$1 RETURNING *",
   [id_institution]
 );
 return result.rows[0];
};

// Validar si el nombre de institución ya existe
export const nameExists = async (institution_name) => {
 const result = await pool.query(
   "SELECT * FROM institution WHERE institution_name=$1",
   [institution_name]
 );
 return result.rows.length > 0;
};
