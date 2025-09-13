import React, { useState } from "react";
import { motion } from "framer-motion";
import "./EventsPage.css";

export default function EventsPage() {
  // Dummy events (local only)
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Annual Alumni Reunion 2025",
      description:
        "Join us for our biggest reunion yet! Reconnect with classmates, enjoy great food, and celebrate our shared memories.",
      date: "Wednesday, October 15, 2025",
      time: "6:00 PM - 11:00 PM",
      venue: "Grand Ballroom, Downtown Hotel",
      attendees: "150/200 attendees",
      organizer: "Alumni Committee",
      category: "Reunion",
      registered: false,
    },
    {
      id: 2,
      title: "Professional Development Workshop",
      description:
        "Learn essential skills for career advancement in the digital age. Topics include leadership, communication, and networking.",
      date: "Sunday, September 28, 2025",
      time: "2:00 PM - 5:00 PM",
      venue: "Innovation Center, Room 301",
      attendees: "45/60 attendees",
      organizer: "Career Services",
      category: "Workshop",
      registered: true,
    },
    {
      id: 3,
      title: "Global Networking Mixer",
      description:
        "Meet alumni across different industries and regions. Build meaningful professional connections.",
      date: "Friday, November 7, 2025",
      time: "7:00 PM - 10:00 PM",
      venue: "City Rooftop Lounge",
      attendees: "90/120 attendees",
      organizer: "Networking Committee",
      category: "Networking",
      registered: false,
    },
  ]);

  // Toggle Register button
  const handleRegister = (id) => {
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, registered: !ev.registered } : ev
      )
    );
  };

  return (
    <div className="events-page">
      {/* Stats Summary */}
      <div className="stats-grid">
        <div className="stat-card">Upcoming Events: {events.length}</div>
        <div className="stat-card">
          Your Registrations: {events.filter((e) => e.registered).length}
        </div>
        <div className="stat-card">
          Cities with Events:{" "}
          {
            new Set(
              events.map(
                (e) => e.venue.split(",").pop().trim() // last part of venue as city
              )
            ).size
          }
        </div>
      </div>

      <h2 className="section-title">Upcoming Events</h2>

      {/* Event Cards */}
      <div className="events-grid">
        {events.map((ev, i) => (
          <motion.div
            key={ev.id}
            className="event-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className={`badge badge-${ev.category.toLowerCase()}`}>
              {ev.category}
            </span>
            <h3>{ev.title}</h3>
            <p>{ev.description}</p>

            <p>📅 {ev.date}</p>
            <p>⏰ {ev.time}</p>
            <p>📍 {ev.venue}</p>
            <p>👥 {ev.attendees}</p>
            <p>Organized by {ev.organizer}</p>

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
    </div>
  );
}
