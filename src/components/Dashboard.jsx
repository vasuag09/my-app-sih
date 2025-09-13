import React from "react";
import "./Dashboard.css";
import { useSelector } from "react-redux";

export default function Dashboard() {
    const user = useSelector(state => state.user.user.user_metadata);
  return (
    <div className="dash-grid">
      <section className="dash-welcome">
        <h2>Welcome back, {user.name} 👋</h2>
        <p>Here's a quick overview of your network.</p>
      </section>

      <section className="dash-cards">
        <div className="card">Total Alumni<br/><strong>200</strong></div>
        <div className="card">Active Networks<br/><strong>147</strong></div>
        <div className="card">Success Stories<br/><strong>1,200+</strong></div>
      </section>

      <section className="dash-activity">
        <h3>Recent Activity</h3>
        <ul>
          <li>John from 2018 posted a job</li>
          <li>Event: Reunion scheduled on Oct 10</li>
          <li>New mentorship request</li>
        </ul>
      </section>
    </div>
  );
}
