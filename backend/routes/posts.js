import express from "express";
import { getPosts, addPost } from "../controllers/posts.js";

const router = express.Router();

// GET /api/posts
router.get("/", getPosts);

// POST /api/posts
router.post("/", addPost);

export default router;
