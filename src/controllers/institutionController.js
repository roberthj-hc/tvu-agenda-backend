import * as InstitutionModel from "../models/institutionModel.js";

// Obtener todas las instituciones
export const getInstitutions = async (req, res, next) => {
 try {
   const institutions = await InstitutionModel.getAllInstitutions();
   res.json(institutions);
 } catch (err) {
   next(err);
 }
};

// Obtener institución por ID
export const getInstitution = async (req, res, next) => {
 try {
   const { id } = req.params;
   const institution = await InstitutionModel.getInstitutionById(id);
   if (!institution) return res.status(404).json({ error: "Institución no encontrada" });
   res.json(institution);
 } catch (err) {
   next(err);
 }
};

// Crear institución
export const createInstitution = async (req, res, next) => {
 try {
   const { institution_name, address } = req.body;
   if (!institution_name || !address)
     return res.status(400).json({ error: "Nombre y dirección son requeridos" });

   // Validar nombre único
   const exists = await InstitutionModel.nameExists(institution_name);
   if (exists) return res.status(400).json({ error: "Nombre de institución ya existe" });

   const newInstitution = await InstitutionModel.createInstitution({ institution_name, address });
   res.status(201).json(newInstitution);
 } catch (err) {
   next(err);
 }
};

// Actualizar institución
export const updateInstitutionController = async (req, res, next) => {
 try {
   const { id } = req.params;
   const { institution_name, address } = req.body;
   if (!institution_name || !address)
     return res.status(400).json({ error: "Nombre y dirección son requeridos" });

   const updatedInstitution = await InstitutionModel.updateInstitution(id, { institution_name, address });
   if (!updatedInstitution) return res.status(404).json({ error: "Institución no encontrada" });

   res.json(updatedInstitution);
 } catch (err) {
   next(err);
 }
};

// Eliminar institución
export const deleteInstitutionController = async (req, res, next) => {
 try {
   const { id } = req.params;

   // Validar si hay contactos asociados antes de eliminar
   const contactsResult = await req.app.locals.pool.query(
     "SELECT * FROM contact WHERE id_institution=$1 AND is_active=TRUE",
     [id]
   );
   if (contactsResult.rows.length > 0) {
     return res.status(400).json({ error: "No se puede eliminar institución con contactos activos" });
   }

   const deletedInstitution = await InstitutionModel.deleteInstitution(id);
   if (!deletedInstitution) return res.status(404).json({ error: "Institución no encontrada" });

   res.json({ message: "Institución eliminada correctamente", deletedInstitution });
 } catch (err) {
   next(err);
 }
};
