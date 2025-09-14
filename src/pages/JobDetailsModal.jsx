// src/components/JobDetailsModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./JobDetailsModal.css";
import { supabase } from "../store/supaBaseClient";

export default function JobDetailsModal({ job, onClose, currentUser, onApplied }) {
  const [applied, setApplied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cover, setCover] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const { data } = await supabase
        .from("job_applications")
        .select("id")
        .eq("job_id", job.id)
        .eq("applicant_id", currentUser.id)
        .maybeSingle();
      setApplied(Boolean(data));
    })();
  }, [job.id, currentUser]);

  async function handleApply(e) {
    e.preventDefault();
    if (!currentUser) {
      alert("Please sign in to apply");
      return;
    }
    setSaving(true);
    try {
      let resume_url = null;
      if (resumeFile) {
        const fileName = `${currentUser.id}/${Date.now()}_${resumeFile.name}`;
        const { error: uploadErr } = await supabase.storage
          .from("resumes")
          .upload(fileName, resumeFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        resume_url = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/resumes/${fileName}`;
      }

      const { error } = await supabase.from("job_applications").insert([
        {
          job_id: job.id,
          applicant_id: currentUser.id,
          cover_letter: cover,
          resume_url,
        },
      ]);
      if (error) throw error;
      setApplied(true);
      alert("Applied successfully!");
      if (onApplied) onApplied();
    } catch (err) {
      console.error("apply error", err);
      alert("Failed to apply: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveJob() {
    // placeholder: you can persist this in a saved_jobs table
    alert("Saved (demo) — implement saved_jobs table if needed.");
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target.classList.contains("modal-overlay") && onClose()}>
      <motion.div className="modal-card" initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="modal-header">
          <h2>{job.title}</h2>
          <div>
            <button className="btn ghost" onClick={handleSaveJob}>Save</button>
            <button className="btn" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="modal-body">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div className="job-meta-large">
                <div className="muted">{job.company} · {job.location} · {job.job_type}</div>
                {job.salary_range && <div className="salary">{job.salary_range}</div>}
              </div>

              <section>
                <h4>Job Description</h4>
                <div className="muted" dangerouslySetInnerHTML={{ __html: job.description || "No description provided." }} />
              </section>

              <section style={{ marginTop: 12 }}>
                <h4>Requirements</h4>
                <div className="muted" dangerouslySetInnerHTML={{ __html: job.requirements || "-" }} />
              </section>

            </div>

            <aside style={{ width: 320 }}>
              <div className="panel" style={{ padding: 12 }}>
                <h4 style={{ margin: "6px 0" }}>Job Details</h4>
                <div className="muted">Posted by: {job.posted_by ? job.posted_by : '—'}</div>
                <div className="muted" style={{ marginTop: 8 }}>{job.created_at ? new Date(job.created_at).toLocaleDateString() : "-"}</div>
                <div style={{ marginTop: 12 }}>
                  <button className="btn primary" onClick={() => { /* focus apply */ document.getElementById("coverInput")?.focus(); }} aria-label="Apply now">
                    Apply Now
                  </button>
                </div>
              </div>
            </aside>
          </div>

          <section style={{ marginTop: 16 }}>
            <h4>Apply</h4>
            {applied ? (
              <div className="applied-note">You have applied to this job.</div>
            ) : (
              <form onSubmit={handleApply} className="apply-form">
                <label>Cover letter</label>
                <textarea id="coverInput" value={cover} onChange={(e) => setCover(e.target.value)} placeholder="Write a short cover letter..." />

                <label style={{ marginTop: 8 }}>Resume (optional)</label>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0] || null)} />

                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button className="btn primary" type="submit" disabled={saving}>
                    {saving ? "Sending..." : "Submit Application"}
                  </button>
                  <button className="btn ghost" type="button" onClick={() => setCover("")}>Clear</button>
                </div>
              </form>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}
