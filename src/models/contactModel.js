import pool from "../config/db.js";

// Obtener todos los contactos activos
export const getAllContacts = async () => {
 const result = await pool.query(
   `SELECT c.id_contact, c.id_person, c.id_institution, c.position, c.description,
           c.registration_date, c.is_active, c.created_by,
           p.name AS person_name, p.last_name_1, p.last_name_2,
           i.institution_name,
           u.ci AS created_by_ci
    FROM contact c
    JOIN person p ON c.id_person=p.id_person
    JOIN institution i ON c.id_institution=i.id_institution
    JOIN users u ON c.created_by=u.id_user
    ORDER BY c.id_contact`
 );
 return result.rows;
};

// Obtener contacto por ID
export const getContactById = async (id_contact) => {
 const result = await pool.query(
   `SELECT c.id_contact, c.id_person, c.id_institution, c.position, c.description,
           c.registration_date, c.is_active, c.created_by,
           p.name AS person_name, p.last_name_1, p.last_name_2,
           i.institution_name,
           u.ci AS created_by_ci
    FROM contact c
    JOIN person p ON c.id_person=p.id_person
    JOIN institution i ON c.id_institution=i.id_institution
    JOIN users u ON c.created_by=u.id_user
    WHERE c.id_contact=$1`,
   [id_contact]
 );
 return result.rows[0];
};

// Crear contacto
export const createContact = async ({ id_person, id_institution, position, description, created_by }) => {
 // Validar duplicado (id_person + id_institution)
 const exists = await pool.query(
   "SELECT * FROM contact WHERE id_person=$1 AND id_institution=$2",
   [id_person, id_institution]
 );
 if (exists.rows.length > 0) throw new Error("Ya existe un contacto con esta persona e institución");

 const result = await pool.query(
   `INSERT INTO contact
    (id_person, id_institution, position, description, registration_date, is_active, created_by)
    VALUES ($1, $2, $3, $4, NOW(), TRUE, $5)
    RETURNING *`,
   [id_person, id_institution, position, description, created_by]
 );
 return result.rows[0];
};

// Actualizar contacto
export const updateContact = async (id_contact, { id_person, id_institution, position, description, is_active }) => {
 // Validar duplicado si cambia persona o institución
 const exists = await pool.query(
   "SELECT * FROM contact WHERE id_person=$1 AND id_institution=$2 AND id_contact<>$3",
   [id_person, id_institution, id_contact]
 );
 if (exists.rows.length > 0) throw new Error("Ya existe un contacto con esta persona e institución");

 const result = await pool.query(
   `UPDATE contact
    SET id_person=$1, id_institution=$2, position=$3, description=$4, is_active=$5
    WHERE id_contact=$6
    RETURNING *`,
   [id_person, id_institution, position, description, is_active, id_contact]
 );
 return result.rows[0];
};

// Desactivar contacto (soft delete)
export const deactivateContact = async (id_contact) => {
 const result = await pool.query(
   "UPDATE contact SET is_active=FALSE WHERE id_contact=$1 RETURNING *",
   [id_contact]
 );
 return result.rows[0];
};

// Eliminar contacto físicamente
export const deleteContact = async (id_contact) => {
 const result = await pool.query(
   "DELETE FROM contact WHERE id_contact=$1 RETURNING *",
   [id_contact]
 );
 return result.rows[0];
};
