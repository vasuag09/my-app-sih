import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./DonationsPage.css";
import { supabase } from "../store/supaBaseClient";
import { useAuth } from "../AuthContext";

import CountUp from "react-countup";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function StatCard({ icon, value, label }) {
  return (
    <div className="dp-stat-card">
      <div className="dp-stat-icon">{icon}</div>
      <div className="dp-stat-value">{value}</div>
      <div className="dp-stat-label">{label}</div>
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div className="dp-progress-wrap" aria-hidden>
      <div className="dp-progress">
        <div className="dp-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="dp-progress-percent">{Math.round(percent)}%</div>
    </div>
  );
}

export default function DonationsPage() {
  const { user } = useAuth ? useAuth() : { user: null };
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const { data: campaignsData } = await supabase
          .from("campaigns")
          .select("*");

        const { data: donationsData } = await supabase
          .from("donations")
          .select("*");

        if (!mounted) return;

        // Demo campaigns
        const seedCampaigns = [
          {
            id: "c1",
            title: "Student Scholarship Fund",
            description: "Help provide scholarships for deserving students.",
            goal_amount: 50000,
            raised_amount: 32750,
            category: "Education",
            end_date: new Date(Date.now() + 45 * 24 * 3600 * 1000).toISOString(),
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "c2",
            title: "Campus Innovation Lab",
            description:
              "Fund a state-of-the-art innovation lab for student entrepreneurs.",
            goal_amount: 100000,
            raised_amount: 67500,
            category: "Infrastructure",
            end_date: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
            status: "active",
            created_at: new Date().toISOString(),
          },
          {
            id: "c3",
            title: "Alumni Emergency Relief Fund",
            description:
              "Support alumni facing unexpected financial hardships.",
            goal_amount: 25000,
            raised_amount: 18200,
            category: "Relief",
            end_date: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
            status: "active",
            created_at: new Date().toISOString(),
          },
        ];

        // Demo donations
        const seedDonations = [
          {
            id: "d1",
            campaign_id: "c1",
            donor_id: "u1",
            donor_name: "Anonymous",
            amount: 1000,
            anonymous: true,
            created_at: new Date().toISOString(),
          },
          {
            id: "d2",
            campaign_id: "c2",
            donor_id: "u2",
            donor_name: "Sarah Chen '19",
            amount: 250,
            anonymous: false,
            created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
          },
          {
            id: "d3",
            campaign_id: "c3",
            donor_id: "u3",
            donor_name: "Michael R.",
            amount: 100,
            anonymous: false,
            created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          },
        ];

        setCampaigns(seedCampaigns);
        setDonations(seedDonations);
        setError(null);
      } catch (e) {
        console.error("fetch donations page", e);
        setError("Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  // Derived stats
  const totalRaisedThisYear = donations.reduce(
    (s, d) => s + Number(d.amount || 0),
    0
  );
  const activeDonors = new Set(donations.map((d) => d.donor_id)).size;
  const activeCampaigns = campaigns.filter((c) => c.status !== "closed").length;
  const successRate =
    campaigns.length === 0
      ? 0
      : Math.round(
          (campaigns.filter(
            (c) => Number(c.raised_amount) >= Number(c.goal_amount)
          ).length /
            campaigns.length) *
            100
        );

  // Fake donate
  function handleQuickDonate(amount, campaignId) {
    const newDonation = {
      id: "d-" + Math.random().toString(36).slice(2, 8),
      campaign_id: campaignId || null,
      donor_id: (user && user.id) || "local",
      donor_name: (user && user.name) || "You",
      amount,
      anonymous: false,
      created_at: new Date().toISOString(),
    };
    setDonations((s) => [newDonation, ...s]);
    setCampaigns((cs) =>
      cs.map((c) =>
        c.id === campaignId
          ? { ...c, raised_amount: Number(c.raised_amount) + amount }
          : c
      )
    );
    setSuccessMsg(
      `🎉 Thank you for donating ₹${amount}! Your contribution makes a difference.`
    );
    setTimeout(() => setSuccessMsg(""), 4000); // auto-hide
  }

  // 📊 Sample chart data for Your Impact
  const impactData = [
    { month: "Jan", donations: 2000 },
    { month: "Feb", donations: 3500 },
    { month: "Mar", donations: 5000 },
    { month: "Apr", donations: 4000 },
    { month: "May", donations: 6000 },
    { month: "Jun", donations: 7500 },
  ];

  return (
    <div className="page page-donations">
      <div className="page-inner">
        <header className="dp-header">
          <h1 className="page-title">Donations</h1>
          <p className="dp-sub">
            Support your alma mater and fellow alumni through meaningful
            contributions
          </p>
        </header>

        {successMsg && <div className="dp-success-msg">{successMsg}</div>}

        <section className="dp-stats">
          <StatCard
            icon="💰"
            value={`₹${(totalRaisedThisYear / 1000).toFixed(1)}k`}
            label="Total Raised This Year"
          />
          <StatCard icon="🧑‍🤝‍🧑" value={activeDonors} label="Active Donors" />
          <StatCard
            icon="🎯"
            value={activeCampaigns}
            label="Active Campaigns"
          />
          <StatCard
            icon="🏆"
            value={`${successRate}%`}
            label="Campaign Success Rate"
          />
        </section>

        {/* Tabs */}
        <nav className="dp-tabs" role="tablist" aria-label="Donations tabs">
          <button
            className={tab === "active" ? "active" : ""}
            onClick={() => setTab("active")}
          >
            Active Campaigns
          </button>
          <button
            className={tab === "tiers" ? "active" : ""}
            onClick={() => setTab("tiers")}
          >
            Donation Tiers
          </button>
          <button
            className={tab === "impact" ? "active" : ""}
            onClick={() => setTab("impact")}
          >
            Your Impact
          </button>
        </nav>

        <div className="dp-main-grid">
          <main className="dp-main-col">
            {loading && <div className="dp-loading">Loading...</div>}
            {error && <div className="dp-error">Error: {error}</div>}

            {/* Active Campaigns */}
            {tab === "active" && (
              <div className="dp-campaign-list">
                {campaigns.map((c) => {
                  const goal = Number(c.goal_amount);
                  const raised = Number(c.raised_amount);
                  const percent = goal > 0 ? (raised / goal) * 100 : 0;
                  const donorsCount = donations.filter(
                    (d) => d.campaign_id === c.id
                  ).length;
                  return (
                    <motion.article
                      key={c.id}
                      className="dp-campaign-card"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="dp-campaign-left">🎓</div>
                      <div className="dp-campaign-body">
                        <div className="dp-campaign-head">
                          <h3>{c.title}</h3>
                          <span className="dp-badge">
                            {c.category || "General"}
                          </span>
                        </div>
                        <p className="dp-campaign-desc">{c.description}</p>
                        <div className="dp-campaign-progress-line">
                          <span>
                            ₹{raised.toLocaleString()} of ₹
                            {goal.toLocaleString()}
                          </span>
                          <ProgressBar percent={percent} />
                        </div>
                        <div className="dp-campaign-stats">
                          <div>👥 {donorsCount} donors</div>
                        </div>
                        <div className="dp-campaign-actions">
                          <button
                            className="btn-primary"
                            onClick={() => handleQuickDonate(500, c.id)}
                          >
                            ❤ Donate ₹500
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

            {/* Tiers */}
            {tab === "tiers" && (
              <div className="dp-tiers">
                <h3>Donation Tiers</h3>
                <div className="dp-tier-grid">
                  <div className="dp-tier-card">
                    <strong>Supporter</strong>
                    <div>₹500</div>
                    <button onClick={() => handleQuickDonate(500)}>Donate</button>
                  </div>
                  <div className="dp-tier-card">
                    <strong>Patron</strong>
                    <div>₹2,500</div>
                    <button onClick={() => handleQuickDonate(2500)}>
                      Donate
                    </button>
                  </div>
                  <div className="dp-tier-card">
                    <strong>Champion</strong>
                    <div>₹10,000</div>
                    <button onClick={() => handleQuickDonate(10000)}>
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Impact */}
            {tab === "impact" && (
              <div className="dp-impact">
                <h3>Your Impact</h3>

                {!user && <p>Sign in to see personalised impact.</p>}

                {user && (
                  <>
                    {/* Animated Stats */}
                    <div className="dp-stats">
                      <div className="dp-stat-card">
                        <div className="dp-stat-value">
                          <CountUp end={120} duration={2.5} />
                        </div>
                        <div className="dp-stat-label">
                          Scholarships Sponsored
                        </div>
                      </div>
                      <div className="dp-stat-card">
                        <div className="dp-stat-value">
                          ₹<CountUp end={450000} duration={2.5} />
                        </div>
                        <div className="dp-stat-label">Funds Raised</div>
                      </div>
                      <div className="dp-stat-card">
                        <div className="dp-stat-value">
                          <CountUp end={35} duration={2.5} />
                        </div>
                        <div className="dp-stat-label">Events Supported</div>
                      </div>
                    </div>

                    {/* Chart */}
                    <div className="dp-chart-wrap">
                      <h3 className="dp-chart-title">Donations Over Time</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={impactData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="donations"
                            stroke="#0b5cff"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}
              </div>
            )}
          </main>

          <aside className="dp-side-col">
            <section className="dp-quick-donate">
              <h4>Quick Donate</h4>
              <div className="dp-quick-grid">
                {[25, 50, 100, 250].map((amt) => (
                  <button key={amt} onClick={() => handleQuickDonate(amt)}>
                    ₹{amt}
                  </button>
                ))}
              </div>
              <button
                className="btn-primary wide"
                onClick={() => {
                  const amt = Number(prompt("Enter custom amount"));
                  if (amt > 0) handleQuickDonate(amt);
                }}
              >
                Custom Amount
              </button>
            </section>

            <section className="dp-recent">
              <h4>Recent Donations</h4>
              <ul>
                {donations.slice(0, 5).map((d) => (
                  <li key={d.id}>
                    <strong>
                      {d.anonymous ? "Anonymous" : d.donor_name || "Alumnus"}
                    </strong>{" "}
                    — ₹{d.amount}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
