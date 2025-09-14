import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./auth-modals.css";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../../apis/auth"; // 🔑 Supabase signup API
import LoadingSpinner from "../UI/LoadingSpinner";
import ErrorBlock from "../UI/ErrorBlock";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/userSlice";
import logo from "../../assets/MainLogo/logo.png";

export default function SignUpModal({
  show,
  onClose = () => {},
  onSuccess = () => {},
  switchToSignIn = () => {},
}) {
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    education: "",
    workExperience: "",
    skills: [],
    linkedin: "",
    github: "",
    twitter: "",
    country: "", // ✅ new
    city: "",
    role: "student",
  });
  const [skillInput, setSkillInput] = useState("");
  const firstRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const mutation = useMutation({
    mutationFn: signUp,
    // keep onError if you want react-query to manage toasts etc
    onError: (error) => {
      setErr(error.message || "Signup failed. Try again.");
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
      setForm({
        name: "",
        email: "",
        password: "",
        phone: "",
        education: "",
        workExperience: "",
        skills: [],
        linkedin: "",
        github: "",
        twitter: "",
        country: "", // ✅ new
        city: "",
      });
      setSkillInput("");
      setErr("");
      mutation.reset();
    }
  }, [show]);

  function handleAddSkill() {
    if (skillInput.trim() && !form.skills.includes(skillInput.trim())) {
      setForm((s) => ({ ...s, skills: [...s.skills, skillInput.trim()] }));
      setSkillInput("");
    }
  }

  function handleRemoveSkill(skill) {
    setForm((s) => ({ ...s, skills: s.skills.filter((sk) => sk !== skill) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErr("");

    if (!form.name || !form.email || form.password.length < 4) {
      setErr("Please fill valid name, email and password (min 4 chars).");
      return;
    }

    try {
      // await result so we can inspect user/session
      const { user, session } = await mutation.mutateAsync(form);
      console.log("Signup result:", { user, session });

      if (!user) {
        throw new Error("Signup succeeded but no user returned.");
      }

      // // // normalize user object that you store in Redux (id, name, email)
      // const reduxUser = {
      //   id: user.id,
      //   name: user.user_metadata?.name || form.name || user.email,
      //   email: user.email,
      //   phone: user.user_metadata?.phone || "",
      //   education: user.user_metadata?.education || "",
      //   workExperience: user.user_metadata?.workExperience || "",
      //   skills: user.user_metadata?.skills || [],
      //   linkedin: user.user_metadata?.linkedin || "",
      //   github: user.user_metadata?.github || "",
      //   twitter: user.user_metadata?.twitter || "",
      // };

      await dispatch(userActions.login(user));

      // If Supabase returned a session (no email confirmation required), navigate
      if (session && session.access_token) {
        // navigate to /:userId/app
        navigate(`/${user.id}/app`, { replace: true });
        onClose();
        return;
      }

      // // If no session, usually email confirmation is required.
      // // Show message and send user to a verification/info page (or show inline UI)
      // setErr(
      //   "Signup successful — check your email to confirm your account. " +
      //     "You will be redirected after email verification."
      // );
      // // Optionally navigate to a "Check your email" route:
      // navigate("/check-email", { state: { email: user.email } });
    } catch (error) {
      setErr(error.message || "Signup failed. Try again.");
    }
  }
  if (mutation.isLoading) {
    return <LoadingSpinner />;
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
          >
            {/* Left Column */}
            <div className="am-left">
              <div className="am-header">
                <h3 className="am-title">Create Account</h3>
                <button
                  className="am-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <form className="am-body" onSubmit={handleSubmit}>
                {err && (
                  <div style={{ marginBottom: 8 }}>
                    <ErrorBlock title="Error" message={err} />
                  </div>
                )}

                {/* Full Name */}
                <label className="am-field">
                  <span className="am-label">Full name</span>
                  <input
                    name="name" // ✅ added
                    ref={firstRef}
                    value={form.name}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, name: e.target.value }))
                    }
                    placeholder="Jane Doe"
                    required
                  />
                </label>

                {/* Email */}
                <label className="am-field">
                  <span className="am-label">Email</span>
                  <input
                    name="email" // ✅ added
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, email: e.target.value }))
                    }
                    placeholder="you@example.com"
                    required
                  />
                </label>

                {/* Password */}
                <label className="am-field">
                  <span className="am-label">Password</span>
                  <input
                    name="password" // ✅ added
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, password: e.target.value }))
                    }
                    placeholder="Choose a password (min 4 chars)"
                    minLength={4}
                    required
                  />
                </label>
                {/* Role */}
                <label className="am-field">
                  <span className="am-label">I am a</span>
                  <div className="role-toggle">
                    <label
                      className={`role-option ${
                        form.role === "student" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="student"
                        checked={form.role === "student"}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, role: e.target.value }))
                        }
                      />
                      Student
                    </label>

                    <label
                      className={`role-option ${
                        form.role === "alumni" ? "active" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="alumni"
                        checked={form.role === "alumni"}
                        onChange={(e) =>
                          setForm((s) => ({ ...s, role: e.target.value }))
                        }
                      />
                      Alumni
                    </label>
                  </div>
                </label>

                {/* Phone */}
                <label className="am-field">
                  <span className="am-label">Phone Number</span>
                  <input
                    name="phone" // ✅ added
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, phone: e.target.value }))
                    }
                    placeholder="+91 9876543210"
                  />
                </label>
                {/* Country */}
                <label className="am-field">
                  <span className="am-label">Country</span>
                  <input
                    name="country"
                    type="text"
                    value={form.country}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, country: e.target.value }))
                    }
                    placeholder="e.g. United States"
                    required
                  />
                </label>
                {/* City */}
                <label className="am-field">
                  <span className="am-label">City</span>
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, city: e.target.value }))
                    }
                    placeholder="e.g. San Francisco"
                    required
                  />
                </label>
                {/* Education */}
                <label className="am-field">
                  <span className="am-label">Education</span>
                  <input
                    name="education" // ✅ added
                    type="text"
                    value={form.education}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, education: e.target.value }))
                    }
                    placeholder="B.Tech in Computer Science"
                  />
                </label>

                {/* Work Experience */}
                <label className="am-field">
                  <span className="am-label">Current Work Experience</span>
                  <input
                    name="workExperience" // ✅ added
                    type="text"
                    value={form.workExperience}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, workExperience: e.target.value }))
                    }
                    placeholder="Software Engineer at XYZ"
                  />
                </label>

                {/* Skills */}
                <div className="am-field">
                  <span className="am-label">Skills</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      name="skills" // ✅ added
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill"
                    />
                    <button
                      type="button"
                      className="btn primary"
                      onClick={handleAddSkill}
                    >
                      Add
                    </button>
                  </div>
                  <div className="skills-list">
                    {form.skills.map((skill) => (
                      <span key={skill} className="skill-chip">
                        {skill}
                        <button
                          type="button"
                          className="remove-skill"
                          onClick={() => handleRemoveSkill(skill)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <label className="am-field">
                  <span className="am-label">LinkedIn</span>
                  <input
                    name="linkedin" // ✅ added
                    type="url"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, linkedin: e.target.value }))
                    }
                    placeholder="https://linkedin.com/in/username"
                  />
                </label>

                <label className="am-field">
                  <span className="am-label">GitHub</span>
                  <input
                    name="github" // ✅ added
                    type="url"
                    value={form.github}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, github: e.target.value }))
                    }
                    placeholder="https://github.com/username"
                  />
                </label>

                <label className="am-field">
                  <span className="am-label">Twitter</span>
                  <input
                    name="twitter" // ✅ added
                    type="url"
                    value={form.twitter}
                    onChange={(e) =>
                      setForm((s) => ({ ...s, twitter: e.target.value }))
                    }
                    placeholder="https://twitter.com/username"
                  />
                </label>

                {/* Actions */}
                <div className="am-actions">
                  <button
                    type="submit"
                    className="btn primary"
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Creating..." : "Create account"}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    onClick={() => switchToSignIn()}
                  >
                    Already have an account?
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column */}
            <motion.div
              className="am-right"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <img src={logo} alt="Alumni" />
              <h2>Welcome to AlumConnect 🎓</h2>
              <p>Join our alumni network to connect, grow, and inspire.</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
