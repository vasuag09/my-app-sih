// src/components/AwardsPage.jsx
import React from "react";
import "./AwardsPage.css";

const awardData = [
  {
    title: "Alumnus of the Year",
    description:
      "Recognizing exceptional professional achievement and service to the alumni community",
    nominations: 23,
    deadline: "March 15, 2025",
    maxNominations: 30,
    color: "yellow",
    icon: "👑",
  },
  {
    title: "Outstanding Mentor",
    description:
      "Celebrating alumni who have made significant impact through mentoring others",
    nominations: 18,
    deadline: "March 15, 2025",
    maxNominations: 30,
    color: "lightblue",
    icon: "🎓",
  },
  {
    title: "Innovation Excellence",
    description:
      "Honoring groundbreaking innovations and technological achievements",
    nominations: 15,
    deadline: "March 15, 2025",
    maxNominations: 30,
    color: "lavender",
    icon: "⚡",
  },
];

export default function AwardsPage() {
  return (
    <div className="awards-page">
      <h1>Alumni Awards Program</h1>
      <p>Recognizing excellence and celebrating outstanding achievements</p>

      <div className="stats-cards">
        <div className="stat-card">
          <p>🏆</p>
          <h2>97</h2>
          <span>Total Nominations</span>
        </div>
        <div className="stat-card">
          <p>👥</p>
          <h2>1,234</h2>
          <span>Community Votes</span>
        </div>
        <div className="stat-card">
          <p>📅</p>
          <h2>45</h2>
          <span>Days Until Ceremony</span>
        </div>
        <div className="stat-card">
          <p>🏅</p>
          <h2>6</h2>
          <span>Award Categories</span>
        </div>
      </div>

      <div className="tabs">
        <button>Award Categories</button>
        <button>2025 Nominees</button>
        <button>Past Winners</button>
        <button>Award Ceremony</button>
      </div>

      <div className="cards">
        {awardData.map((award, index) => (
          <div
            key={index}
            className="award-card"
            style={{ backgroundColor: award.color }}
          >
            <h3>
              {award.icon} {award.title}
            </h3>
            <p>{award.description}</p>
            <p className="meta">Deadline: {award.deadline}</p>
            <div className="progress-bar">
              <div
                className="progress"
                style={{
                  width: `${(award.nominations / award.maxNominations) * 100}%`,
                }}
              ></div>
            </div>
            <div className="card-buttons">
              <button className="nominate-btn">Nominate</button>
              <button className="details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
