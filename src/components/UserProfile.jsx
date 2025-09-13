import React, { useState } from "react";
import { motion } from "framer-motion";
import "./UserProfile.css";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const user = useSelector((state) => state.user.user.user_metadata);

  // Normalize data so profile always has arrays
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "Not provided",
    bio: user.bio || "This is a sample bio.",
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

  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const saveProfile = () => {
    setProfile(tempProfile);
    setEditing(false);
  };

  const cancelEdit = () => {
    setTempProfile(profile);
    setEditing(false);
  };

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="profile-header">
        <div>
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
        </div>
        <button onClick={() => setEditing(true)} className="edit-btn">
          ✏️ Edit
        </button>
      </div>

      <div className="profile-section">
        <h3>Basic Information</h3>
        {editing ? (
          <div className="edit-block">
            <input
              type="text"
              name="name"
              value={tempProfile.name}
              onChange={handleChange}
              placeholder="Name"
            />
            <input
              type="email"
              name="email"
              value={tempProfile.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              type="text"
              name="phone"
              value={tempProfile.phone}
              onChange={handleChange}
              placeholder="Phone"
            />
            <textarea
              name="bio"
              value={tempProfile.bio}
              onChange={handleChange}
              placeholder="Bio"
            />
            <div className="action-btns">
              <button onClick={saveProfile} className="save-btn">💾 Save</button>
              <button onClick={cancelEdit} className="cancel-btn">❌ Cancel</button>
            </div>
          </div>
        ) : (
          <ul>
            <li><strong>Email:</strong> {profile.email}</li>
            <li><strong>Phone:</strong> {profile.phone}</li>
          </ul>
        )}
      </div>

      <div className="profile-section">
        <h3>Education</h3>
        <ul>
          {profile.education.length > 0 ? (
            profile.education.map((edu, i) => (
              <li key={i}>🎓 {edu}</li>
            ))
          ) : (
            <li>No education info</li>
          )}
        </ul>
      </div>

      <div className="profile-section">
        <h3>Work Experience</h3>
        <ul>
          {profile.work.length > 0 ? (
            profile.work.map((job, i) => (
              <li key={i}>💼 {job}</li>
            ))
          ) : (
            <li>No work info</li>
          )}
        </ul>
      </div>

      <div className="profile-section">
        <h3>Skills</h3>
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

      <div className="profile-section">
        <h3>Social Links</h3>
        <ul>
          <li>🔗 LinkedIn: {profile.socials.linkedin || "Not added"}</li>
          <li>💻 GitHub: {profile.socials.github || "Not added"}</li>
          <li>🐦 Twitter: {profile.socials.twitter || "Not added"}</li>
        </ul>
      </div>
    </motion.div>
  );
}
