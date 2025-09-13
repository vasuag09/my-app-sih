import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./EventsPage.css";
import { supabase } from "../store/supaBaseClient";
export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error.message);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ✅ Toggle Registration (local only for now, could be stored in Supabase later)
  const handleRegister = (id) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, registered: !ev.registered } : ev
      )
    );
  };

  // ✅ Compute stats
  const stats = {
    upcoming: events.length,
    registered: events.filter((e) => e.registered).length,
    cities: new Set(
      events
        .map((e) =>
          e.venue ? e.venue.split(",").pop().trim() : "Unknown"
        )
    ).size,
  };

  return (
    <div className="events-page">
      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">Upcoming Events: {stats.upcoming}</div>
        <div className="stat-card">Your Registrations: {stats.registered}</div>
        <div className="stat-card">Cities with Events: {stats.cities}</div>
      </div>

      <h2 className="section-title">Upcoming Events</h2>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div className="events-grid">
          {events.length === 0 && <p>No events available.</p>}
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              className="event-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <span className={`badge badge-${ev.category?.toLowerCase() || "general"}`}>
                {ev.category || "General"}
              </span>

              <h3>{ev.title}</h3>
              {ev.image_path && (
                <img
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/events/${ev.image_path}`}
                  alt={ev.title}
                  className="event-img"
                />
              )}

              <p>📅 {ev.date}</p>
              <p>⏰ {ev.time}</p>
              <p>📍 {ev.venue}</p>
              <p>👥 Spots Left: {ev.spots_left ?? "N/A"}</p>
              <p>Organized by {ev.organizer || "Unknown"}</p>

              <button
                className={`btn ${
                  ev.registered ? "btn-registered" : "btn-register"
                }`}
                onClick={() => handleRegister(ev.id)}
              >
                {ev.registered ? "Registered" : "Register"}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
