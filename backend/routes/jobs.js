import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Fetch all jobs
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("jobs")
    .select(`
      id, title, company, location, type, industry, experience, salary_min, salary_max,
      description, requirements, benefits, created_at,
      poster:poster_id ( id, name, role, grad_year )
    `)
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Post job (Only Alumni)
router.post("/", async (req, res) => {
  const { poster_id, title, company, location, type, industry, experience, salary_min, salary_max, description, requirements, benefits } = req.body;

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", poster_id)
    .single();

  if (!profile || profile.role !== "alumni") {
    return res.status(403).json({ error: "Only alumni can post jobs" });
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert([{
      poster_id, title, company, location, type, industry, experience,
      salary_min, salary_max, description, requirements, benefits
    }]);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
