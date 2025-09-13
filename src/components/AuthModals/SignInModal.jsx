import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./auth-modals.css";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "../../apis/auth";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userSlice";
import ErrorBlock from "../UI/ErrorBlock";
import logo from "../../assets/MainLogo/logo.png";
export default function SignInModal({
  show,
  onClose = () => {},
  onSuccess = () => {},
  switchToSignUp = () => {},
  switchToForgot = () => {},
}) {
  const [form, setForm] = useState({ email: "", password: "" });
  const firstRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: signIn,
    onSuccess: ({ user }) => {
      console.log("Data from signIn", user);
      dispatch(userActions.login(user));
      navigate(`${user.id}/app`);
      console.log("Sign In successful", data);
    },
  });

  useEffect(() => {
    if (show) setTimeout(() => firstRef.current?.focus(), 80);
  }, [show]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && show) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  useEffect(() => {
    if (!show) {
      setForm({ email: "", password: "" });
    }
  }, [show]);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const userData = Object.fromEntries(data);
    mutate(userData);
  }

  if (isPending) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
      <ErrorBlock
        title="Sign In Failed"
        message={error.message || "Unable to sign in. Please try again later."}
      />
    );
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="am-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) =>
            e.target.classList.contains("am-overlay") && onClose()
          }
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            className="am-panel-horizontal"
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
          >
            {/* LEFT COLUMN – Form */}
            <div className="am-left">
              <div className="am-header">
                <h3 className="am-title">Welcome back 👋</h3>
                <button
                  className="am-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form className="am-body" onSubmit={handleSubmit}>
                <label className="am-field">
                  <span className="am-label">Email</span>
                  <input
                    name="email"
                    ref={firstRef}
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="am-field">
                  <span className="am-label">Password</span>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, password: e.target.value }))
                    }
                    placeholder="••••••••"
                    minLength={4}
                    required
                  />
                </label>

                <div className="am-actions">
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={isPending}
                  >
                    {isPending ? "Signing in..." : "Sign in"}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => switchToSignUp()}
                  >
                    Create account
                  </button>
                </div>

                <div className="am-footer-links">
                  <button
                    type="button"
                    className="am-link"
                    onClick={() => switchToForgot()}
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN – Illustration / Branding */}
            <div className="am-right">
              <img src={logo} alt="Brand" />
              <h2>Sign in to your Alumni account</h2>
              <p>
                Connect with fellow alumni, explore groups, and stay updated
                with the community 🚀
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
