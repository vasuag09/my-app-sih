import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./auth-modals.css";

/**
 * Props:
 *  - show: boolean
 *  - onClose: fn()
 *  - onSent: fn(info) optional
 *  - switchToSignIn: fn() optional
 */
export default function ForgotPasswordModal({ show, onClose = () => {}, onSent = () => {}, switchToSignIn = () => {} }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const firstRef = useRef(null);

  useEffect(() => { if (show) setTimeout(() => firstRef.current?.focus(), 80); }, [show]);
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape" && show) onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);
  useEffect(() => { if (!show) { setEmail(""); setErr(""); setSuccess(""); setLoading(false); } }, [show]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(""); setSuccess(""); setLoading(true);
    // replace with real API call
    try {
      await new Promise((res, rej) => setTimeout(() => {
        if (!email.includes("@")) return rej(new Error("Enter a valid email"));
        return res();
      }, 700));
      setLoading(false);
      setSuccess("If the email exists, a reset link has been sent.");
      onSent({ email });
    } catch (error) {
      setLoading(false);
      setErr(error.message || "Request failed");
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="am-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target.classList.contains("am-overlay") && onClose()} aria-modal="true" role="dialog">
          <motion.div className="am-panel" initial={{ y: 22, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 12, opacity: 0 }} transition={{ type: "spring", stiffness: 360, damping: 28 }}>
            <div className="am-header">
              <h3 className="am-title">Reset password</h3>
              <button className="am-close" onClick={onClose} aria-label="Close">×</button>
            </div>

            <form className="am-body" onSubmit={handleSubmit}>
              <label className="am-field">
                <span className="am-label">Email</span>
                <input ref={firstRef} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
              </label>

              {err && <div className="am-error" role="alert">{err}</div>}
              {success && <div className="am-success" role="status">{success}</div>}

              <div className="am-actions">
                <button type="submit" className="btn primary" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
                <button type="button" className="btn ghost" onClick={() => switchToSignIn()}>Back to sign in</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
