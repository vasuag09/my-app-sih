import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./EventsPage.css";
import { supabase } from "../store/supaBaseClient";

function EventsPage() {
  const [allEvents, setAllEvents] = useState([
    {
      id: 1,
      title: "Alumni Networking Night",
      date: "2025-09-20",
      time: "5:30 PM - 8:00 PM",
      venue: "Rooftop Bar, Business District",
      category: "networking",
      registered: false,
      image_path: "event1.jpg",
      spots_left: 50,
      organizer: "Alumni Committee",
      description:
        "Connect with fellow alumni in a relaxed rooftop setting with great views and networking opportunities.",
    },
    {
      id: 2,
      title: "Professional Development Workshop",
      date: "2025-09-28",
      time: "2:00 PM - 5:00 PM",
      venue: "Innovation Center, Room 301",
      category: "workshop",
      registered: true,
      image_path: "event2.jpg",
      spots_left: 30,
      organizer: "Career Services",
      description:
        "Enhance your professional skills with expert-led workshops and hands-on learning experiences.",
    },
    {
      id: 3,
      title: "Mentorship Program Launch",
      date: "2025-09-30",
      time: "1:00 PM - 4:00 PM",
      venue: "University Campus, Alumni Hall",
      category: "mentorship",
      registered: false,
      image_path: "event3.jpg",
      spots_left: 40,
      organizer: "Mentorship Program",
      description:
        "Join our new mentorship initiative connecting experienced alumni with recent graduates.",
    },
    {
      id: 4,
      title: "Annual Alumni Reunion 2025",
      date: "2025-10-15",
      time: "6:00 PM - 11:00 PM",
      venue: "Grand Ballroom, Downtown Hotel",
      category: "reunion",
      registered: false,
      image_path: "event4.jpg",
      spots_left: 150,
      organizer: "Alumni Committee",
      description:
        "Celebrate another year of achievements with classmates, faculty, and lifelong friends.",
    },
    {
      id: 5,
      title: "Tech Innovation Summit",
      date: "2025-10-25",
      time: "9:00 AM - 5:00 PM",
      venue: "Tech Hub, Silicon Valley",
      category: "conference",
      registered: false,
      image_path: "event5.jpg",
      spots_left: 200,
      organizer: "Tech Industry Leaders",
      description:
        "Explore the latest trends in technology with industry experts and thought leaders.",
    },
    {
      id: 6,
      title: "Startup Pitch Night",
      date: "2025-11-05",
      time: "7:00 PM - 9:00 PM",
      venue: "Innovation Hub, Downtown",
      category: "networking",
      registered: false,
      image_path: "event6.jpg",
      spots_left: 100,
      organizer: "Startup Incubator",
      description:
        "Watch promising startups pitch their ideas and network with entrepreneurs and investors.",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Fetch events from Supabase
  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error.message);
    } else if (data && data.length > 0) {
      setAllEvents((prev) => {
        const filtered = prev.filter((ev) => !data.some((d) => d.id === ev.id));
        return [...filtered, ...data];
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Toggle Registration Status
  const handleRegister = async (id) => {
  setAllEvents((prev) =>
    prev.map((ev) => (ev.id === id ? { ...ev, registered: true } : ev))
  );

  const updatedEvent = allEvents.find((ev) => ev.id === id);
  if (updatedEvent && updatedEvent.hasOwnProperty("registered")) {
    const { error } = await supabase
      .from("events")
      .update({ registered: true })
      .eq("id", id);

    if (error) {
      console.error("Error updating registration status:", error.message);
    }
  }

  // ✅ Updated modal message with extra details
  setModalMessage(
    `🎉 Registration Successful!\n\n` +
      `You have registered for ${updatedEvent?.title}.\n\n` +
      `📅 Date: ${updatedEvent?.date}\n` +
      `⏰ Time: ${updatedEvent?.time}\n` +
      `📍 Venue: ${updatedEvent?.venue}\n\n`
      //`📩 A confirmation email has been sent to your inbox.`
  );
  setShowModal(true);
};


  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return { day, month, year };
  };

  // Get category display name and color
  const getCategoryInfo = (category) => {
    const categories = {
      networking: { name: "Networking", color: "networking" },
      workshop: { name: "Workshop", color: "workshop" },
      mentorship: { name: "Mentorship", color: "mentorship" },
      reunion: { name: "Reunion", color: "reunion" },
      conference: { name: "Conference", color: "conference" },
    };
    return (
      categories[category?.toLowerCase()] || { name: "Event", color: "general" }
    );
  };

  // Stats
  const stats = {
    upcoming: allEvents.length,
    registered: allEvents.filter((e) => e.registered).length,
    cities: new Set(
      allEvents.map((e) =>
        e.venue ? e.venue.split(",").pop().trim() : "Unknown"
      )
    ).size,
  };

  return (
    <div className="events-page">
      {/* Registration Modal */}
{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <motion.div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="modal-icon">🎉</div>
      {/* Render rich text with line breaks */}
      <div className="modal-body">
        {modalMessage.split("\n").map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
      <button className="modal-close" onClick={() => setShowModal(false)}>
        Close
      </button>
    </motion.div>
  </div>
)}


      {/* Header */}
      <motion.div
        className="events-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="header-content">
          <h1>Alumni Events</h1>
          <p>Stay connected, network, and grow with your alumni community.</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="stats-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="stats-grid stats-3">
          <motion.div
            className="stat-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📅</div>
            <div className="stat-number">{stats.upcoming}</div>
            <div className="stat-label">Upcoming Events</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">✅</div>
            <div className="stat-number">{stats.registered}</div>
            <div className="stat-label">Your Registrations</div>
          </motion.div>
          <motion.div
            className="stat-card"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="stat-icon">📍</div>
            <div className="stat-number">{stats.cities}</div>
            <div className="stat-label">Cities with Events</div>
          </motion.div>
        </div>
      </motion.div>

      {/* Section Title */}
      <motion.h1
        className="section-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        Upcoming Events
      </motion.h1>

      {/* Events Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading amazing events...</p>
        </div>
      ) : (
        <div className="events-grid">
          {allEvents.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📅</div>
              <h3>No events available</h3>
              <p>Check back later for exciting upcoming events!</p>
            </div>
          )}
          {allEvents.map((event, index) => {
            const dateInfo = formatDate(event.date);
            const categoryInfo = getCategoryInfo(event.category);

            return (
              <motion.div
                key={event.id}
                className="event-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                <div className="event-card-inner">
                  {/* Date Badge */}
                  <div className="date-badge">
                    <div className="date-day">{dateInfo.day}</div>
                    <div className="date-month">{dateInfo.month}</div>
                    <div className="date-year">{dateInfo.year}</div>
                  </div>

                  {/* Event Content */}
                  <div className="event-content">
                    <div className="event-header">
                      <span
                        className={`event-badge badge-${categoryInfo.color}`}
                      >
                        {categoryInfo.name}
                      </span>
                      {event.registered && (
                        <span className="registered-indicator">✓</span>
                      )}
                    </div>

                    <h3 className="event-title">{event.title}</h3>

                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}

                    <div className="event-details">
                      <div className="event-detail">
                        <span className="detail-icon">⏰</span>
                        <span className="detail-text">{event.time}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon">📍</span>
                        <span className="detail-text">{event.venue}</span>
                      </div>
                      <div className="event-detail">
                        <span className="detail-icon">👥</span>
                        <span className="detail-text">
                          {event.spots_left} spots left
                        </span>
                      </div>
                      <div className="event-detail organizer">
                        <span className="detail-icon">🎯</span>
                        <span className="detail-text">by {event.organizer}</span>
                      </div>
                    </div>

                    <button
                      className={`btn-register ${
                        event.registered ? "registered" : ""
                      }`}
                      onClick={() => {
                        if (!event.registered) handleRegister(event.id);
                      }}
                      disabled={event.registered}
                    >
                      <span className="btn-register-icon">
                        {event.registered ? "✓" : ""}
                      </span>
                      <span className="btn-register-text">
                        {event.registered ? "Registered" : "Register Now"}
                      </span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default EventsPage;
