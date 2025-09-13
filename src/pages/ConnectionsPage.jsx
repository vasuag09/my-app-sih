import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import "./ConnectionsPage.css"; // Import CSS file

export default function ConnectionsPage() {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:3000/api/connections/users/${userId}`)
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []));

    fetch(`http://localhost:3000/api/connections/accepted/${userId}`)
      .then((res) => res.json())
      .then((data) => setConnections(Array.isArray(data) ? data : []));

    fetch(`http://localhost:3000/api/connections/requests/${userId}`)
      .then((res) => res.json())
      .then((data) => setRequests(Array.isArray(data) ? data : []));
  }, [userId]);

  function sendRequest(receiverId) {
    fetch("http://localhost:3000/api/connections/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requester_id: userId, receiver_id: receiverId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          alert(data.error);
        } else {
          alert("Request sent!");
        }
      })
      .catch((err) => console.error("Failed to send request:", err));
  }

  function respondToRequest(connId, status) {
    fetch(`http://localhost:3000/api/connections/respond/${connId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).then(() => {
      setRequests((prev) => prev.filter((r) => r.id !== connId));
    });
  }

  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="connections-page">
      <h2 className="page-title">🤝 Connect with Alumni</h2>

      {/* All Users */}
      <section>
        <h3 className="section-title">All Alumni</h3>
        <div className="cards-grid">
          {users.map((u, index) => (
            <motion.div
              key={u.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="card"
            >
              <div className="avatar">{getInitials(u.name)}</div>
              <div className="card-info">
                <h4>{u.name}</h4>
                <p>
                  {u.city}, {u.country}
                </p>
              </div>
              <button
                className="btn connect-btn"
                onClick={() => sendRequest(u.id)}
              >
                Connect
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pending Requests */}
      <section>
        <h3 className="section-title">Connection Requests</h3>
        {requests.length > 0 ? (
          <div className="cards-list">
            {requests.map((req) => (
              <motion.div key={req.id} className="card request-card">
                <div className="avatar">{getInitials(req.requester?.name)}</div>
                <div className="card-info">
                  <p>
                    <strong>{req.requester?.name}</strong> wants to connect
                  </p>
                </div>
                <div className="actions">
                  <button
                    className="btn accept-btn"
                    onClick={() => respondToRequest(req.id, "accepted")}
                  >
                    Accept
                  </button>
                  <button
                    className="btn reject-btn"
                    onClick={() => respondToRequest(req.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No pending requests</p>
        )}
      </section>

      {/* Accepted Connections */}
      <section>
        <h3 className="section-title">My Connections</h3>
        {connections.length > 0 ? (
          <div className="cards-grid">
            {connections.map((c, index) => {
              const otherUser =
                c.requester?.id === userId ? c.receiver : c.requester;
              return (
                <motion.div
                  key={c.id}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="card connection-card"
                >
                  <div className="avatar">{getInitials(otherUser?.name)}</div>
                  <div className="card-info">
                    <h4>{otherUser?.name}</h4>
                    <p>
                      {otherUser?.city}, {otherUser?.country}
                    </p>
                    <span className="status">✅ Connected</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <p className="empty-text">No connections yet</p>
        )}
      </section>
    </div>
  );
}
