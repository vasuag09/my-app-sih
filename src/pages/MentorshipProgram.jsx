import React, { useState } from "react";
import "./MentorshipProgram.css";
import {
  FaStar,
  FaSearch,
  FaCalendarAlt,
  FaHeart,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
} from "react-icons/fa";

export default function MentorshipProgram() {
  const [activeTab, setActiveTab] = useState("mentor");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    role: "Mentee",
    goals: "",
    bio: "",
    availability: "1-2 hours per month",
  });

  const mentors = [
    {
      name: "Sarah Chen",
      role: "Senior Product Manager",
      company: "Google • 8 years",
      rating: 4.9,
      reviews: 23,
      bio: "Passionate about helping early-career professionals navigate the tech industry. I build base of developers.",
      expertise: ["Product Management", "Strategy", "Leadership"],
      sessions: 45,
      successStories: 12,
      availability: "2 slots available",
    },
    {
      name: "Michael Rodriguez",
      role: "Principal Software Engineer",
      company: "Microsoft • 12 years",
      rating: 4.8,
      reviews: 31,
      bio: "Former startup founder turned big tech engineer. I help developers advance their careers.",
      expertise: ["Software Engineering", "System Design", "Career Growth"],
      sessions: 67,
      successStories: 18,
      availability: "1 slot available",
    },
  ];

  const mentees = [
    {
      name: "Alex Johnson",
      role: "Junior Developer",
      company: "Tech Startup • 1 year",
      bio: "Recent graduate looking to grow my career in software engineering. Eager to learn best practices and industry insights.",
      goals: ["Career Advancement", "Technical Skills", "Networking"],
    },
    {
      name: "Emma Davis",
      role: "Marketing Associate",
      company: "E-commerce Company • 2 years",
      bio: "Aspiring marketing leader seeking guidance on career growth and developing strategic thinking.",
      goals: ["Leadership Skills", "Strategy", "Personal Branding"],
    },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setShowModal(false);
  };

  return (
    <div className="mentorship-container">
      {/* Header */}
      <header className="mentorship-header">
        <h1>Mentorship Program</h1>
        <p>Connect with experienced alumni to accelerate your career growth</p>
        <button className="mentorship-btn join-btn" onClick={() => setShowModal(true)}>
          + Join Program
        </button>
      </header>

      {/* Stats */}
      <section className="mentorship-stats">
        <div className="stat-card">
          <FaHeart className="stat-icon red" />
          <h2>45</h2>
          <p>Active Mentors</p>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon blue" />
          <h2>128</h2>
          <p>Mentees</p>
        </div>
        <div className="stat-card">
          <FaStar className="stat-icon gold" />
          <h2>89%</h2>
          <p>Success Rate</p>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon green" />
          <h2>240</h2>
          <p>Sessions This Month</p>
        </div>
      </section>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "mentor" ? "active" : ""}
          onClick={() => setActiveTab("mentor")}
        >
          Find a Mentor
        </button>
        <button
          className={activeTab === "mentee" ? "active" : ""}
          onClick={() => setActiveTab("mentee")}
        >
          Find a Mentee
        </button>
        <button
          className={activeTab === "connections" ? "active" : ""}
          onClick={() => setActiveTab("connections")}
        >
          My Connections
        </button>
      </div>

      {/* Content */}
      {activeTab === "mentor" && (
        <div className="mentorship-grid">
          {mentors.map((m, index) => (
            <div key={index} className="mentorship-card">
              <div className="mentor-header">
                <span className="avatar">👩‍💻</span>
                <div className="mentor-info">
                  <h3>{m.name}</h3>
                  <p className="mentor-role">{m.role}</p>
                  <p className="mentor-company">{m.company}</p>
                </div>
                  <div className="rating">
                    ⭐ {m.rating} <span>({m.reviews} reviews)</span>
                  </div>
              </div>
              <p>{m.bio}</p>
              <div className="tags">
                {m.expertise.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
              <div className="availability">{m.availability}</div>
              <div className="mentor-footer">
                <span>{m.sessions} Sessions</span>
                <span>{m.successStories} Success Stories</span>
              </div>
              <button className="primary-btn">📅 Request Session</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "mentee" && (
        <div className="mentorship-grid">
          {mentees.map((m, index) => (
            <div key={index} className="mentorship-card">
              <div className="mentor-header">
                <span className="avatar">👩‍💻</span>
                <div className="mentor-info">
                  <h3>{m.name}</h3>
                  <p className="mentor-role">{m.role}</p>
                  <p className="mentor-company">{m.company}</p>
                </div>
                <div className="rating">
                  ⭐ {m.rating} <span>({m.reviews} reviews)</span>
                </div>
              </div>

              <p>{m.bio}</p>
              <div className="tags">
                {m.goals.map((goal, i) => (
                  <span key={i} className="tag">{goal}</span>
                ))}
              </div>
              <button className="primary-btn">🤝 Offer Mentorship</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "connections" && (
        <div className="mentorship-grid">
          <p>You have no active connections yet.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>
            <h2>Join the Mentorship Program</h2>
            <p className="modal-subtitle">
              Register as a mentor, mentee, or both to start building meaningful connections
            </p>

            <form onSubmit={handleSubmit}>
              {/* Role selection */}
              <label>I want to participate as:</label>
              <div className="role-options">
                <div
                  className={`role-card ${formData.role === "Mentee" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: "Mentee" })}
                >
                  <FaUserGraduate className="role-icon" />
                  <h4>Mentee</h4>
                  <p>Seek guidance from experienced alumni</p>
                </div>
                <div
                  className={`role-card ${formData.role === "Mentor" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: "Mentor" })}
                >
                  <FaChalkboardTeacher className="role-icon" />
                  <h4>Mentor</h4>
                  <p>Share your expertise with others</p>
                </div>
                <div
                  className={`role-card ${formData.role === "Both" ? "active" : ""}`}
                  onClick={() => setFormData({ ...formData, role: "Both" })}
                >
                  <FaUserGraduate className="role-icon" />
                  <h4>Both</h4>
                  <p>Learn and teach in different areas</p>
                </div>
              </div>

              {/* Goals */}
              <label>Goals</label>
              <textarea
                name="goals"
                placeholder="What are your career goals and what kind of guidance are you looking for?"
                value={formData.goals}
                onChange={handleChange}
              />

              {/* Bio */}
              <label>Bio</label>
              <textarea
                name="bio"
                placeholder="Tell us about yourself, your background, and what you bring to the mentorship program..."
                value={formData.bio}
                onChange={handleChange}
              />

              {/* Availability */}
              <label>Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
              >
                <option>1-2 hours per month</option>
                <option>3-5 hours per month</option>
                <option>Weekly sessions</option>
                <option>Flexible</option>
              </select>

              {/* Actions */}
              <div className="modal-actions">
                <button type="submit" className="primary-btn">
                  Join Mentorship Program
                </button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
