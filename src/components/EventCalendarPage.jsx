import React, { useState } from "react";
import { motion } from "framer-motion";
import Calendar from "react-calendar"; // install: npm install react-calendar
import "./EventCalendarPage.css";

export default function EventCalendarPage() {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Alumni Networking Night",
      date: "2025-09-20",
      time: "5:30 PM - 8:00 PM",
      venue: "Rooftop Bar, Business District",
      category: "Networking",
      registered: false,
    },
    {
      id: 2,
      title: "Professional Development Workshop",
      date: "2025-09-28",
      time: "2:00 PM - 5:00 PM",
      venue: "Innovation Center, Room 301",
      category: "Workshop",
      registered: true,
    },
    {
      id: 3,
      title: "Mentorship Program Launch",
      date: "2025-09-30",
      time: "1:00 PM - 4:00 PM",
      venue: "University Campus, Alumni Hall",
      category: "Mentorship",
      registered: false,
    },
  ]);

  const [viewDate, setViewDate] = useState(new Date());

  const toggleRegister = (id) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, registered: !e.registered } : e))
    );
  };

  const upcomingEvents = events.filter((e) => new Date(e.date) >= new Date());

  return (
    <div className="event-calendar-page">
      <div className="calendar-container">
        <h2>Event Calendar</h2>
        <p className="subtitle">
          Stay updated with alumni events and activities
        </p>

        <Calendar
          onChange={setViewDate}
          value={viewDate}
          tileContent={({ date }) => {
            const ev = events.find(
              (e) => new Date(e.date).toDateString() === date.toDateString()
            );
            return ev ? (
              <span
                className={`event-dot ${ev.registered ? "registered-dot" : ""}`}
              />
            ) : null;
          }}
        />
      </div>

      <div className="sidebar">
        <h3>📅 Upcoming Events</h3>
        {upcomingEvents.length === 0 && <p>No upcoming events</p>}

        {upcomingEvents.map((ev) => (
          <motion.div
            key={ev.id}
            className="sidebar-card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card-header">
              <div className="avatar">{ev.title.charAt(0).toUpperCase()}</div>
              <div>
                <div className={`badge badge-${ev.category.toLowerCase()}`}>
                  {ev.category}
                </div>
                <h4>{ev.title}</h4>
              </div>
            </div>

            <p>📅 {ev.date}</p>
            <p>⏰ {ev.time}</p>
            <p>📍 {ev.venue}</p>

            <button
              className={`btn ${
                ev.registered ? "btn-registered" : "btn-register"
              }`}
              onClick={() => toggleRegister(ev.id)}
            >
              {ev.registered ? "Registered" : "RSVP"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
