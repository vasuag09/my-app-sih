import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./HomePage.css";
import logo from "../../assets/MainLogo/logo.png"; // place logo at src/pages/HomePage/assets/logo.png
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";
// Spacer component for consistent vertical spacing
function Spacer({ size = 24 }) {
  return (
    <div className="hp-spacer" style={{ height: size }} aria-hidden="true" />
  );
}

// small reusable stat card
function StatCard({ icon, label, value, bg = "#eef6ff" }) {
  return (
    <div
      className="hp-stat-card"
      role="status"
      aria-label={`${label} ${value}`}
    >
      <div className="hp-stat-icon" style={{ background: bg }}>
        {icon}
      </div>
      <div className="hp-stat-body">
        <div className="hp-stat-label">{label}</div>
        <div className="hp-stat-value">{value}</div>
      </div>
    </div>
  );
}

// feature card
function Feature({ icon, title, children }) {
  return (
    <motion.article
      className="feature-card"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="feature-icon">{icon}</div>
      <div>
        <h4 className="feature-title">{title}</h4>
        <p className="feature-desc">{children}</p>
      </div>
    </motion.article>
  );
}

export default function HomePage() {
  // Initialize n8n chat on mount
  useEffect(() => {
    createChat({
      webhookUrl:
        "https://manav12.app.n8n.cloud/webhook/15c22f30-d03a-47b5-9dd0-ed856d4eac49/chat", // ✅ replace with your n8n webhook URL
      // leave target undefined → floating widget mode
      theme: {
        chatBubble: { background: "#4f46e5", textColor: "#fff" },
        launcher: { background: "#4f46e5" },
        header: { background: "#4f46e5", textColor: "#fff" },
      },
      position: "bottom-right", // can be "bottom-left"
      defaultOpen: false,
      initialMessages: [
        "Hi there! 👋 I’m AlumBot, your smart assistant",
        "I can help you explore events, connect with alumni, and answer any questions you have. What would you like to do today?",
      ],
      // keeps it closed until clicked
    });
  }, []);
  return (
    <div className="hp-page">
      <main className="hp-container">
        {/* HERO */}
        <motion.section
          className="hp-hero hp-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hp-hero-inner">
            <div className="hp-hero-text">
              <h1>Welcome to AlumConnect</h1>
              <p className="hp-sub">
                The premier platform for alumni engagement, networking, and
                professional growth. Connect with fellow graduates, find
                mentors, and advance your career.
              </p>

              <div className="hp-hero-ctas">
                {/* <Link to="/join" className="btn primary">
                  Join Our Network
                </Link> */}

                <Link to="#features" className="btn outline">
                  Learn More
                </Link>
              </div>
            </div>

            <div className="hp-hero-visual">
              <motion.div
                className="hp-hero-card"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.12 }}
              >
                <img
                  src={logo}
                  alt="AlumniConnect logo"
                  className="hp-card-logo"
                />
                <div>
                  <strong>Trusted by Alumni Networks</strong>
                  <div className="hp-card-sub">Secure · Private · Fast</div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* spacer between hero and stats */}
        <Spacer size={20} />

        {/* STATS ROW */}
        <section className="hp-stats hp-section">
          <StatCard
            label="Total Alumni"
            value="200"
            bg="#e8f3ff"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zM3 21a9 9 0 0118 0"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Active Network"
            value="147"
            bg="#e9fff0"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M16 11.37A4 4 0 1112.63 8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Global Reach"
            value="6 Countries"
            bg="#f8efff"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
          <StatCard
            label="Success Stories"
            value="1,200+"
            bg="#fff7e8"
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l2.09 4.26L19 7.27l-3.5 3.41L16.18 18 12 15.27 7.82 18l.68-7.32L4.99 7.27l4.91-.01L12 2z"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            }
          />
        </section>

        {/* slightly larger spacer */}
        <Spacer size={26} />

        {/* FEATURES GRID */}
        <section id="features" className="hp-features hp-section">
          <div className="hp-features-grid">
            <Feature
              icon={<div className="icon-circle">👥</div>}
              title="Alumni Directory"
            >
              Discover and connect with alumni from your institution worldwide.
            </Feature>

            <Feature
              icon={<div className="icon-circle">🤝</div>}
              title="Mentorship Program"
            >
              Get guidance from experienced professionals in your field.
            </Feature>

            <Feature
              icon={<div className="icon-circle">📅</div>}
              title="Events & Networking"
            >
              Attend reunions, workshops, and networking events.
            </Feature>
          </div>
        </section>

        {/* spacer before CTA band */}
        <Spacer size={28} />

        {/* CTA BAND */}
        <section className="hp-cta-band hp-section">
          <motion.div
            className="hp-cta-inner"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div>
              <h3>Ready to grow your alumni network?</h3>
            </div>
            {/* <div>
              <Link to="/join" className="btn primary">
                Create an account — it's free
              </Link>
            </div> */}
          </motion.div>
        </section>

        {/* final spacer to separate from footer */}
        <Spacer size={38} />
        {/* SUPERCHARGE FEATURES (add below CTA band, above final Spacer) */}
        <motion.section
          id="supercharge"
          className="hp-super hp-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="hp-super-hero">
            <h2>
              Three ways <span className="hp-strong">AlumConnect</span> will
              <span className="hp-superword"> supercharge </span> the alumni
              network
            </h2>
            <p className="hp-super-sub">
              Seamless engagement, a data goldmine, and philanthropy
              tools—designed to grow a thriving community.
            </p>
          </div>

          {/* 01 Engage your network */}
          <article className="hp-super-row">
            <motion.div
              className="hp-super-col hp-super-text"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="hp-num">01</div>
              <h3 className="hp-super-title">Engage your network</h3>
              <ol className="hp-super-list">
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  A complete social space—SSO with Google, Facebook, LinkedIn,
                  or email.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Members post jobs, upload photos, comment, and share updates.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Smart directory search to reach out, connect, and communicate.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Share photos and news alongside events and fundraising.
                </motion.li>
              </ol>
            </motion.div>

            <motion.div
              className="hp-super-col hp-super-visual"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.08 }}
            >
              <div className="hp-browser">
                <div className="hp-browser-bar">
                  <span className="hp-dot red" />
                  <span className="hp-dot amber" />
                  <span className="hp-dot green" />
                </div>
                <div className="hp-browser-body">
                  <img
                    src={logo}
                    alt="AlumConnect UI"
                    className="hp-super-logo"
                  />
                  <div className="hp-badges">
                    <span className="hp-badge">Posts</span>
                    <span className="hp-badge">Jobs</span>
                    <span className="hp-badge">Messages</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </article>

          {/* 02 Build a data goldmine */}
          <article id="goldmine" className="hp-super-row alt">
            <motion.div
              className="hp-super-col hp-super-visual"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="hp-stats-card">
                <div className="hp-stat">
                  <div className="hp-stat-icon">📇</div>
                  <div className="hp-stat-text">
                    <div className="hp-stat-label">Profiles</div>
                    <div className="hp-stat-value">Complete</div>
                  </div>
                </div>
                <div className="hp-vdiv" />
                <div className="hp-stat">
                  <div className="hp-stat-icon">🔎</div>
                  <div className="hp-stat-text">
                    <div className="hp-stat-label">Search</div>
                    <div className="hp-stat-value">Filters</div>
                  </div>
                </div>
                <div className="hp-vdiv" />
                {/* <div className="hp-stat">
                  <div className="hp-stat-icon">📣</div>
                  <div className="hp-stat-text">
                    <div className="hp-stat-label">Comms</div>
                    <div className="hp-stat-value">Email · SMS</div>
                  </div>
                </div> */}
              </div>
            </motion.div>

            <motion.div
              className="hp-super-col hp-super-text"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="hp-num teal">02</div>
              <h3 className="hp-super-title">
                Build a data <span className="hp-strong">goldmine</span>
              </h3>
              <ul className="hp-super-bullets">
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Encourage alumni to complete rich profiles to power
                  personalization.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Sort, filter, and search—save unlimited dynamic lists for
                  campaigns.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Built‑in communications: Email, SMS, and social integrations.
                </motion.li>
              </ul>
            </motion.div>
          </article>

          {/* 03 Philanthropy opportunities */}
          <article className="hp-super-row">
            <motion.div
              className="hp-super-col hp-super-text"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <div className="hp-num">03</div>
              <h3 className="hp-super-title">Philanthropy opportunities</h3>
              <ul className="hp-super-bullets">
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Events—sell tickets to reunions or any limited‑capacity
                  gathering.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Fundraisers—set a target amount and date, then track progress.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Business Directory—promote alumni‑owned businesses within the
                  community.
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25 }}
                >
                  Shop—sell merch and memorabilia to support programs.
                </motion.li>
              </ul>
              {/* <div className="hp-super-cta">
                <Link to="/join" className="btn primary">
                  Get Started
                </Link>
              </div> */}
            </motion.div>

            <motion.div
              className="hp-super-col hp-super-visual"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.06 }}
            >
              <div className="hp-kpis">
                <div className="hp-kpi">
                  <span className="hp-kpi-ic">🎟️</span>
                  <span className="hp-kpi-t">Tickets</span>
                </div>
                <div className="hp-kpi">
                  <span className="hp-kpi-ic">🎯</span>
                  <span className="hp-kpi-t">Target</span>
                </div>
                <div className="hp-kpi">
                  <span className="hp-kpi-ic">🏬</span>
                  <span className="hp-kpi-t">Directory</span>
                </div>
                <div className="hp-kpi">
                  <span className="hp-kpi-ic">🛍️</span>
                  <span className="hp-kpi-t">Shop</span>
                </div>
              </div>
            </motion.div>
          </article>
        </motion.section>
        <div id="n8n-chat"></div>
      </main>
    </div>
  );
}
