import express from "express";
import { getGroups, addGroup } from "../controllers/groups.js";

const router = express.Router();

// GET /api/groups
router.get("/", getGroups);

// POST /api/groups (👉 later protect with admin middleware)
router.post("/", addGroup);

export default router;
