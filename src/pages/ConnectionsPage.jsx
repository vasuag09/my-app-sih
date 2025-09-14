import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import "./ConnectionsPage.css";

export default function ConnectionsPage() {
  const user = useSelector((state) => state.user.user);
  const userId = user?.id;

  const [users, setUsers] = useState([]);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [outgoing, setOutgoing] = useState([]); // track requests I sent

  // Fetch data
  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    const fUsers = fetch(
      `http://localhost:3000/api/connections/users/${userId}`
    ).then((r) => r.json().catch(() => []));
    const fAccepted = fetch(
      `http://localhost:3000/api/connections/accepted/${userId}`
    ).then((r) => r.json().catch(() => []));
    const fRequests = fetch(
      `http://localhost:3000/api/connections/requests/${userId}`
    )
      .then((r) => r.json().catch(() => []))
      .then((data) => {
        setRequests(
          Array.isArray(data) ? data.filter((r) => r && r.requester) : []
        );
        return data;
      });

    Promise.all([fUsers, fAccepted, fRequests])
      .then(([u, a]) => {
        setUsers(Array.isArray(u) ? u : []);
        setConnections(Array.isArray(a) ? a : []);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Derived quick-lookup sets for UI states
  const pendingReceiverIds = useMemo(
    () => new Set(outgoing.map((r) => r.receiver?.id || r.receiver_id)),
    [outgoing]
  );

  const connectedIds = useMemo(() => {
    const s = new Set();
    connections.forEach((c) => {
      // each connection row may have requester/receiver objects
      if (c.requester?.id && c.receiver?.id) {
        if (c.requester.id === userId) s.add(c.receiver.id);
        else if (c.receiver.id === userId) s.add(c.requester.id);
      } else {
        // fallback to ids if shape differs
        if (c.requester_id && c.receiver_id) {
          if (c.requester_id === userId) s.add(c.receiver_id);
          else if (c.receiver_id === userId) s.add(c.requester_id);
        }
      }
    });
    return s;
  }, [connections, userId]);

  async function sendRequest(receiverId) {
    try {
      const res = await fetch("http://localhost:3000/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requester_id: userId, receiver_id: receiverId }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data?.error || "Failed to send request");
        return;
      }
      // Add to outgoing instead of requests
      setOutgoing((prev) => [...prev, data]);
      alert("Request sent");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  }

  async function respondToRequest(connId, status) {
    try {
      await fetch(`http://localhost:3000/api/connections/respond/${connId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setRequests((prev) => prev.filter((r) => r.id !== connId));
      // refresh accepted list optimistically (simpler approach: remove request and re-fetch later)
      if (status === "accepted") {
        // quick naive refresh
        fetch(`http://localhost:3000/api/connections/accepted/${userId}`)
          .then((r) => r.json())
          .then((d) => setConnections(Array.isArray(d) ? d : []))
          .catch(() => {});
      }
    } catch (err) {
      console.error(err);
      alert("Failed to respond");
    }
  }

  function getInitials(name) {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  // Motion variants
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="conn-wrap">
      <header className="conn-header">
        <div>
          <h1>🤝 Connect</h1>
          <p className="muted">
            Find alumni & students, send requests and manage connections.
          </p>
        </div>
      </header>

      <main className="conn-main">
        <section className="panel">
          <h2 className="panel-title">All Alumni</h2>

          {loading ? (
            <div className="loader">Loading…</div>
          ) : users.length === 0 ? (
            <p className="muted">No users found.</p>
          ) : (
            <motion.div
              className="grid"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {users.map((u) => {
                  const roleClass = (u.role || "member")
                    .toString()
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  const isConnected = connectedIds.has(u.id);
                  const isRequested = pendingReceiverIds.has(u.id);

                  return (
                    <motion.article
                      className="card"
                      key={u.id}
                      variants={item}
                      whileHover={{
                        y: -6,
                        boxShadow: "0 10px 30px rgba(18,36,80,0.08)",
                      }}
                    >
                      <div className="left">
                        <div className="avatar" aria-hidden>
                          {getInitials(u.name)}
                        </div>
                        <div className="meta">
                          <h3>{u.name || "Unknown"}</h3>
                          <div className="sub">
                            <span className={`role ${roleClass}`}>
                              {u.role || "Member"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="right">
                        {isConnected ? (
                          <button className="btn btn-ghost" disabled>
                            Connected
                          </button>
                        ) : isRequested ? (
                          <button className="btn btn-muted" disabled>
                            Requested
                          </button>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => sendRequest(u.id)}
                            aria-label={`Connect with ${u.name}`}
                          >
                            Connect
                          </button>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        <aside className="side">
          <section className="panel small">
            <h3>Requests</h3>
            {requests.length === 0 ? (
              <p className="muted">No pending requests</p>
            ) : (
              <div className="list">
                {requests
                  .filter((req) => req && req.requester) // guard nulls
                  .map((req) => (
                    <motion.div key={req.id} className="card request-card">
                      <div className="avatar">
                        {getInitials(req.requester?.name)}
                      </div>
                      <div className="card-info">
                        <p>
                          <strong>
                            {req.requester?.name || "Unknown User"}
                          </strong>{" "}
                          wants to connect
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
            )}
          </section>

          <section className="panel small">
            <h3>My Network</h3>
            <p className="muted">
              {connections.length} connection
              {connections.length !== 1 ? "s" : ""}
            </p>
            <div className="muted small">
              Tip: Accept requests to grow your network.
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
