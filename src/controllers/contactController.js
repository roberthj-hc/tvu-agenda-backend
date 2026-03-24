import * as ContactModel from "../models/contactModel.js";

// Obtener todos los contactos
export const getContacts = async (req, res, next) => {
 try {
   const contacts = await ContactModel.getAllContacts();
   res.json(contacts);
 } catch (err) {
   next(err);
 }
};

// Obtener contacto por ID
export const getContact = async (req, res, next) => {
 try {
   const { id } = req.params;
   const contact = await ContactModel.getContactById(id);
   if (!contact) return res.status(404).json({ error: "Contacto no encontrado" });
   res.json(contact);
 } catch (err) {
   next(err);
 }
};

// Crear contacto
export const createContactController = async (req, res, next) => {
 try {
   const { id_person, id_institution, position, description } = req.body;
   const created_by = req.user.id_user; // Suponiendo que el middleware auth agrega req.user

   if (!id_person || !id_institution || !position)
     return res.status(400).json({ error: "id_person, id_institution y position son requeridos" });

   const newContact = await ContactModel.createContact({ id_person, id_institution, position, description, created_by });
   res.status(201).json(newContact);
 } catch (err) {
   next(err);
 }
};

// Actualizar contacto
export const updateContactController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const { id_person, id_institution, position, description, is_active } = req.body;

   if (!id_person || !id_institution || !position || is_active === undefined)
     return res.status(400).json({ error: "Campos incompletos para actualizar" });

   const updatedContact = await ContactModel.updateContact(id, { id_person, id_institution, position, description, is_active });
   if (!updatedContact) return res.status(404).json({ error: "Contacto no encontrado" });

   res.json(updatedContact);
 } catch (err) {
   next(err);
 }
};

// Desactivar contacto (soft delete)
export const deactivateContactController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const deactivated = await ContactModel.deactivateContact(id);
   if (!deactivated) return res.status(404).json({ error: "Contacto no encontrado" });
   res.json({ message: "Contacto desactivado correctamente", deactivated });
 } catch (err) {
   next(err);
 }
};

// Eliminar contacto físicamente
export const deleteContactController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const deleted = await ContactModel.deleteContact(id);
   if (!deleted) return res.status(404).json({ error: "Contacto no encontrado" });
   res.json({ message: "Contacto eliminado correctamente", deleted });
 } catch (err) {
   next(err);
 }
};
