// src/components/PostJobModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../store/supaBaseClient";
import "./PostJobModal.css";

export default function PostJobModal({ onClose, onCreated, currentUser }) {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "Full-time",
    category: "",
    salary_range: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  async function handleCreate(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Sign in required");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("jobs")
        .insert([{ ...form, posted_by: currentUser.id }])
        .select()
        .single();

      if (error) throw error;
      alert("Job posted");
      if (onCreated) onCreated(data);
    } catch (err) {
      console.error(err);
      alert("Failed to post job: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <motion.form className="modal-card" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onSubmit={handleCreate}>
        <div className="modal-header">
          <h2>Create Job</h2>
          <button className="btn" type="button" onClick={onClose}>Close</button>
        </div>

        <div className="modal-body">
          <label>Job Title</label>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />

          <label>Company</label>
          <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />

          <label>Location</label>
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />

          <label>Job Type</label>
          <select value={form.job_type} onChange={(e) => setForm({ ...form, job_type: e.target.value })}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>

          <label>Category</label>
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <label>Salary Range</label>
          <input value={form.salary_range} onChange={(e) => setForm({ ...form, salary_range: e.target.value })} />

          <label>Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn primary" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post job"}
            </button>
            <button className="btn ghost" type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </motion.form>
    </div>
  );
}
