// src/components/JobCard.jsx
import React from "react";
import "./JobCard.css"; 
import { motion } from "framer-motion";

export default function JobCard({ job, onView }) {
  return (
    <motion.article
      className="job-card panel"
      whileHover={{ y: -6, boxShadow: "0 14px 40px rgba(12,20,50,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <div className="job-left">
        <div className="logo-placeholder" aria-hidden>
          {job.company ? job.company[0].toUpperCase() : "J"}
        </div>

        <div className="job-meta">
          <h3 className="job-title">{job.title}</h3>
          <div className="job-sub">
            <span className="muted">{job.company || "—"}</span>
            <span className="dot">•</span>
            <span className="muted">{job.location || "Remote"}</span>
            <span className="dot">•</span>
            <span className="tag">{job.job_type || "—"}</span>
          </div>
        </div>
      </div>

      <div className="job-actions">
        <button className="btn ghost" onClick={onView} aria-label={`View ${job.title}`}>
          View Details
        </button>
      </div>
    </motion.article>
  );
}
