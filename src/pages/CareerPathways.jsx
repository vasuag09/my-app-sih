import React from "react";
import "./CareerPathways.css";

export default function CareerPathways() {
  return (
    <div className="career-page">
      <h1>Career Pathways</h1>
      <p>Track your professional journey and discover growth opportunities</p>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card">
          <h2>4</h2>
          <span>Milestones Achieved</span>
        </div>
        <div className="stat-card">
          <h2>7</h2>
          <span>Certifications Earned</span>
        </div>
        <div className="stat-card">
          <h2>12</h2>
          <span>Courses Completed</span>
        </div>
        <div className="stat-card">
          <h2>85%</h2>
          <span>Goal Completion Rate</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button>Career Milestones</button>
        <button>Learning Resources</button>
        <button>Mentorship</button>
        <button>Goal Setting</button>
      </div>

      <div className="main-grid">
        {/* Career Timeline */}
        <div className="timeline">
          <h3>Your Career Timeline</h3>
          <ul>
            <li>
              <h4>Started as Junior Developer</h4>
              <p>Joined TechCorp as a junior software developer focusing on web applications</p>
              <span className="date">June 15, 2020</span>
            </li>
            <li>
              <h4>Completed AWS Certification</h4>
              <p>Earned AWS Solutions Architect Associate certification</p>
              <span className="date">March 22, 2021</span>
            </li>
            <li>
              <h4>Promoted to Senior Developer</h4>
              <p>Recognition for outstanding performance and leadership in team projects</p>
              <span className="date">January 15, 2022</span>
            </li>
            <li>
              <h4>Led Cross-functional Team</h4>
              <p>Successfully managed a team of 8 people for major product launch</p>
              <span className="date">September 30, 2023</span>
            </li>
            <li>
              <h4>Pursuing MBA</h4>
              <p>Currently enrolled in part-time MBA program at State University</p>
              <span className="date">August 1, 2024</span>
            </li>
            <li>
              <h4>Transition to Product Manager</h4>
              <p>Goal to move into product management role by end of 2025</p>
              <span className="date">December 31, 2025</span>
            </li>
          </ul>
        </div>

        {/* Right Side */}
        <div className="side-panel">
          <div className="progress-box">
            <h3>Progress Overview</h3>
            <p>Career Progress</p>
            <div className="progress-bar">
              <div className="progress" style={{ width: "67%" }}></div>
            </div>
            <p className="percent">67%</p>

            <h4>Recent Achievements</h4>
            <ul>
              <li>Completed AWS Certification</li>
              <li>Promoted to Senior Developer</li>
              <li>Led Cross-functional Team</li>
            </ul>

            <h4>Upcoming Goals</h4>
            <ul>
              <li>Pursuing MBA</li>
              <li>Transition to Product Manager</li>
            </ul>
          </div>

          <div className="skills-box">
            <h3>Skills Assessment</h3>
            <div className="skill">
              <span>Leadership</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "85%" }}></div>
              </div>
            </div>
            <div className="skill">
              <span>Communication</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "78%" }}></div>
              </div>
            </div>
            <div className="skill">
              <span>Technical Skills</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "92%" }}></div>
              </div>
            </div>
            <div className="skill">
              <span>Project Management</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "75%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
