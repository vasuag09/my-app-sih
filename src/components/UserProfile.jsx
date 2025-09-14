import React, { useState } from "react";
import { motion } from "framer-motion";
import "./UserProfile.css";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const user = useSelector((state) => state.user.user.user_metadata);

  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "Not provided",
    bio: user.bio || "This is a sample bio.",
    role: user.role || "Student",
    education: Array.isArray(user.education)
      ? user.education
      : user.education
      ? [user.education]
      : [],
    work: Array.isArray(user.workExperience)
      ? user.workExperience
      : user.workExperience
      ? [user.workExperience]
      : [],
    skills: Array.isArray(user.skills)
      ? user.skills
      : user.skills
      ? user.skills.split(",").map((s) => s.trim())
      : [],
    socials: user.socials || {
      linkedin: user.linkedin || "",
      github: user.github || "",
      twitter: user.twitter || "",
    },
  });

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Profile Header */}
      <div className="profile-header-card">
        <div>
          {" "}
          <img
            src={`https://ui-avatars.com/api/?name=${profile.name}&background=2c52e0&color=fff`}
            alt="profile"
            className="profile-pic"
          />
          <h2>{profile.name}</h2>
          <span className={`role-badge ${profile.role.toLowerCase()}`}>
            {profile.role}
          </span>
        </div>

        <div>
          {" "}
          <p className="bio">{profile.bio}</p>
        </div>
      </div>

      {/* Info Sections */}
      <div className="profile-grid">
        <div className="card">
          <h3>📌 Basic Information</h3>
          <ul>
            <li>
              <strong>Email:</strong> {profile.email}
            </li>
            <li>
              <strong>Phone:</strong> {profile.phone}
            </li>
          </ul>
        </div>

        <div className="card">
          <h3>🎓 Education</h3>
          <ul>
            {profile.education.length > 0 ? (
              profile.education.map((edu, i) => <li key={i}>{edu}</li>)
            ) : (
              <li>No education info</li>
            )}
          </ul>
        </div>

        <div className="card">
          <h3>💼 Work Experience</h3>
          <ul>
            {profile.work.length > 0 ? (
              profile.work.map((job, i) => <li key={i}>{job}</li>)
            ) : (
              <li>No work info</li>
            )}
          </ul>
        </div>

        <div className="card">
          <h3>⚡ Skills</h3>
          <div className="skills">
            {profile.skills.length > 0 ? (
              profile.skills.map((skill, i) => (
                <span key={i} className="skill-tag">
                  {skill}
                </span>
              ))
            ) : (
              <p>No skills added</p>
            )}
          </div>
        </div>

        <div className="card">
          <h3>🌐 Social Links</h3>
          <div className="social-links">
            {profile.socials.linkedin && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                🔗 LinkedIn
              </a>
            )}
            {profile.socials.github && (
              <a href={profile.socials.github} target="_blank" rel="noreferrer">
                💻 GitHub
              </a>
            )}
            {profile.socials.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noreferrer"
              >
                🐦 Twitter
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
