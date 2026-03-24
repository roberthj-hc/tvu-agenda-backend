import * as PersonModel from "../models/personModel.js";

// Obtener todas las personas
export const getPersons = async (req, res, next) => {
 try {
   const persons = await PersonModel.getAllPersons();
   res.json(persons);
 } catch (err) {
   next(err);
 }
};

// Obtener persona por ID
export const getPerson = async (req, res, next) => {
 try {
   const { id } = req.params;
   const person = await PersonModel.getPersonById(id);
   if (!person) return res.status(404).json({ error: "Persona no encontrada" });
   res.json(person);
 } catch (err) {
   next(err);
 }
};

// Crear persona
export const createPerson = async (req, res, next) => {
 try {
   const { name, last_name_1, last_name_2 } = req.body;
   if (!name || !last_name_1 || !last_name_2) {
     return res.status(400).json({ error: "Todos los campos son requeridos" });
   }

   const newPerson = await PersonModel.createPerson({ name, last_name_1, last_name_2 });
   res.status(201).json(newPerson);
 } catch (err) {
   next(err);
 }
};

// Actualizar persona
export const updatePersonController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const { name, last_name_1, last_name_2, is_active } = req.body;

   if (!name || !last_name_1 || !last_name_2 || is_active === undefined) {
     return res.status(400).json({ error: "Todos los campos son requeridos" });
   }

   const updatedPerson = await PersonModel.updatePerson(id, { name, last_name_1, last_name_2, is_active });
   if (!updatedPerson) return res.status(404).json({ error: "Persona no encontrada" });

   res.json(updatedPerson);
 } catch (err) {
   next(err);
 }
};

// Desactivar persona (soft delete)
export const deactivatePersonController = async (req, res, next) => {
 try {
   const { id } = req.params;

   // Validar si la persona tiene contactos asociados activos
   const contactsResult = await req.app.locals.pool.query(
     "SELECT * FROM contact WHERE id_person=$1 AND is_active=TRUE",
     [id]
   );

   if (contactsResult.rows.length > 0) {
     return res.status(400).json({ error: "No se puede desactivar persona con contactos activos" });
   }

   const deactivatedPerson = await PersonModel.deactivatePerson(id);
   if (!deactivatedPerson) return res.status(404).json({ error: "Persona no encontrada" });

   res.json({ message: "Persona desactivada correctamente", deactivatedPerson });
 } catch (err) {
   next(err);
 }
};
