import pool from "../config/db.js";

// Obtener todos los teléfonos
export const getAllPhones = async () => {
 const result = await pool.query(
   `SELECT ph.id_phone, ph.number, ph.is_active, ph.id_person, ph.id_institution,
           p.name AS person_name,
           i.institution_name
    FROM phone ph
    LEFT JOIN person p ON ph.id_person = p.id_person
    LEFT JOIN institution i ON ph.id_institution = i.id_institution
    ORDER BY ph.id_phone`
 );
 return result.rows;
};

// Obtener teléfono por ID
export const getPhoneById = async (id_phone) => {
 const result = await pool.query(
   `SELECT ph.id_phone, ph.number, ph.is_active, ph.id_person, ph.id_institution,
           p.name AS person_name,
           i.institution_name
    FROM phone ph
    LEFT JOIN person p ON ph.id_person = p.id_person
    LEFT JOIN institution i ON ph.id_institution = i.id_institution
    WHERE ph.id_phone=$1`,
   [id_phone]
 );
 return result.rows[0];
};

// Crear teléfono
export const createPhone = async ({ number, id_person, id_institution }) => {
 if (!id_person && !id_institution) throw new Error("Debe asociarse a una persona o institución");

 const result = await pool.query(
   `INSERT INTO phone (number, is_active, id_person, id_institution)
    VALUES ($1, TRUE, $2, $3)
    RETURNING *`,
   [number, id_person || null, id_institution || null]
 );
 return result.rows[0];
};

// Actualizar teléfono
export const updatePhone = async (id_phone, { number, is_active, id_person, id_institution }) => {
 if (!id_person && !id_institution) throw new Error("Debe asociarse a una persona o institución");

 const result = await pool.query(
   `UPDATE phone
    SET number=$1, is_active=$2, id_person=$3, id_institution=$4
    WHERE id_phone=$5
    RETURNING *`,
   [number, is_active, id_person || null, id_institution || null, id_phone]
 );
 return result.rows[0];
};

// Desactivar teléfono (soft delete)
export const deactivatePhone = async (id_phone) => {
 const result = await pool.query(
   "UPDATE phone SET is_active=FALSE WHERE id_phone=$1 RETURNING *",
   [id_phone]
 );
 return result.rows[0];
};

// Eliminar teléfono físicamente
export const deletePhone = async (id_phone) => {
 const result = await pool.query(
   "DELETE FROM phone WHERE id_phone=$1 RETURNING *",
   [id_phone]
 );
 return result.rows[0];
};
