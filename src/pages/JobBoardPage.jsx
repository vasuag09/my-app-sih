// src/pages/JobBoard.jsx
import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../store/supaBaseClient";
import JobCard from "./JobCard";
import JobDetailsModal from "./JobDetailsModal";
import PostJobModal from "./PostJobModal";
import { motion } from "framer-motion";
import "./JobBoard.css";
import { useSelector } from "react-redux";

export default function JobBoardPage() {
  const user = useSelector((s) => s.user.user);
  const userId = user?.id;
  // role may be in different places depending on your auth/profile shape
  const role =
    user?.user_metadata?.role || user?.role || user?.user_metadata?.role || "";

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  async function fetchJobs() {
    setLoading(true);
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("fetch jobs error", error);
      setJobs([]);
    } else {
      setJobs(data || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchJobs();

    // realtime: refresh on any change to jobs table
    const channel = supabase
      .channel("public:jobs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "jobs" },
        () => fetchJobs()
      )
      .subscribe();

    return () => {
      // cleanup
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const inQuery =
        !query ||
        j.title.toLowerCase().includes(query.toLowerCase()) ||
        (j.company || "").toLowerCase().includes(query.toLowerCase()) ||
        (j.description || "").toLowerCase().includes(query.toLowerCase());
      const byType = !filterType || (j.job_type || "") === filterType;
      const byCat = !filterCategory || (j.category || "") === filterCategory;
      return inQuery && byType && byCat;
    });
  }, [jobs, query, filterType, filterCategory]);

  const types = Array.from(new Set(jobs.map((j) => j.job_type).filter(Boolean)));
  const categories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean)));

  const canPost = (role || "").toString().toLowerCase() === "alumni";

  return (
    <div className="jobs-page">
      <header className="jobs-header">
        <div>
          <h1>Job Board</h1>
          <p className="muted">Find opportunities posted by fellow alumni</p>
        </div>

        <div className="actions">
          <input
            className="search"
            placeholder="Search jobs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button
            className={`btn primary ${!canPost ? "disabled" : ""}`}
            onClick={() => {
              if (!canPost) {
                alert("Only alumni can post jobs.");
                return;
              }
              setShowPostModal(true);
            }}
            aria-disabled={!canPost}
          >
            + Post a Job
          </button>
        </div>
      </header>

      <div className="jobs-grid">
        <aside className="jobs-filters panel">
          <h4>Filters</h4>

          <div className="filter-group">
            <label>Job Type</label>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">All</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <section className="jobs-list">
          {loading ? (
            <div className="panel">Loading jobs…</div>
          ) : filtered.length === 0 ? (
            <div className="panel">No jobs match your criteria.</div>
          ) : (
            <div className="job-results">
              {filtered.map((job, idx) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.04 }}
                >
                  <JobCard job={job} onView={() => setSelectedJob(job)} />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          currentUser={user}
          onApplied={() => {
            fetchJobs();
            setSelectedJob(null);
          }}
        />
      )}

      {showPostModal && (
        <PostJobModal
          onClose={() => setShowPostModal(false)}
          onCreated={() => {
            setShowPostModal(false);
            fetchJobs();
          }}
          currentUser={user}
        />
      )}
    </div>
  );
}
