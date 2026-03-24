import express from "express";
import {
 getInstitutions,
 getInstitution,
 createInstitution,
 updateInstitutionController,
 deleteInstitutionController,
} from "../controllers/institutionController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas
//router.use(authMiddleware);

// CRUD instituciones
router.get("/", getInstitutions);             // GET /api/institutions
router.get("/:id", getInstitution);           // GET /api/institutions/:id
router.post("/", createInstitution);          // POST /api/institutions
router.put("/:id", updateInstitutionController); // PUT /api/institutions/:id
router.delete("/:id", deleteInstitutionController); // DELETE /api/institutions/:id

export default router;
