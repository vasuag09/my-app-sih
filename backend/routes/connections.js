import express from "express";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// -----------------------------
// Fetch all users except self
// -----------------------------
router.get("/users/:id", async (req, res) => {
  const userId = req.params.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, city, country, role")
    .neq("id", userId);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// -----------------------------
// Send connection request
// -----------------------------
router.post("/request", async (req, res) => {
  const { requester_id, receiver_id } = req.body;

  // Check if connection already exists (both directions)
  const { data: existing, error: checkError } = await supabase
    .from("connections")
    .select("*")
    .or(
      `and(requester_id.eq.${requester_id},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${requester_id})`
    )
    .maybeSingle();

  if (checkError) return res.status(500).json({ error: checkError.message });
  if (existing) {
    return res
      .status(400)
      .json({ error: "Connection already exists or pending." });
  }

  // Insert new request and return with requester/receiver objects
  const { data, error } = await supabase
    .from("connections")
    .insert([{ requester_id, receiver_id, status: "pending" }])
    .select(
      `
        id,
        status,
        requester:requester_id ( id, name, city, country ),
        receiver:receiver_id ( id, name, city, country )
      `
    )
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// -----------------------------
// Get all pending requests for user (where user is receiver)
// -----------------------------
router.get("/requests/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("connections")
    .select(
      `
        id,
        status,
        requester:requester_id ( id, name, city, country ),
        receiver:receiver_id ( id, name, city, country )
      `
    )
    .eq("receiver_id", id)
    .eq("status", "pending");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// -----------------------------
// Accept / Reject connection
// -----------------------------
router.put("/respond/:id", async (req, res) => {
  const { id } = req.params; // connection id
  const { status } = req.body;

  const { data, error } = await supabase
    .from("connections")
    .update({ status })
    .eq("id", id)
    .select(
      `
        id,
        status,
        requester:requester_id ( id, name, city, country ),
        receiver:receiver_id ( id, name, city, country )
      `
    )
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// -----------------------------
// Get all accepted connections for a user
// -----------------------------
router.get("/accepted/:id", async (req, res) => {
  const userId = req.params.id;

  const { data, error } = await supabase
    .from("connections")
    .select(
      `
        id,
        status,
        requester:requester_id ( id, name, city, country ),
        receiver:receiver_id ( id, name, city, country )
      `
    )
    .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`)
    .eq("status", "accepted");

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
