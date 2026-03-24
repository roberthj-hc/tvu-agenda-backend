import express from "express";
import {
 getPersons,
 getPerson,
 createPerson,
 updatePersonController,
 deactivatePersonController,
} from "../controllers/personController.js";
//import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Todas las rutas protegidas
//router.use(authMiddleware);

// CRUD personas
router.get("/", getPersons);             // GET /api/persons
router.get("/:id", getPerson);           // GET /api/persons/:id
router.post("/", createPerson);          // POST /api/persons
router.put("/:id", updatePersonController);   // PUT /api/persons/:id
router.patch("/deactivate/:id", deactivatePersonController); // PATCH /api/persons/deactivate/:id

export default router;
