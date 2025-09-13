import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "../store/supaBaseClient";
import "./AdminPage.css";

export default function AdminPage() {
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    type: "",
    category: "",
    spots_left: "",
    organizer: "",
    image_path: ""
  });

  // ✅ Fetch events, posts, users
  useEffect(() => {
    fetchEvents();
    fetchPosts();
    fetchUsers();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setEvents(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, content, category, created_at, profiles(name)")
      .order("created_at", { ascending: false });
    if (!error) setPosts(data || []);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, created_at"); // assuming profiles table exists
    if (!error) setUsers(data || []);
  };

  // ✅ Add event
  const addEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    setLoading(true);

    const { data, error } = await supabase.from("events").insert([newEvent]).select();

    if (!error && data) {
      setEvents([data[0], ...events]);
      setNewEvent({
        title: "",
        date: "",
        time: "",
        venue: "",
        type: "",
        category: "",
        spots_left: "",
        organizer: "",
        image_path: ""
      });
    }
    setLoading(false);
  };

  // ✅ Remove event
  const removeEvent = async (id) => {
    setLoading(true);
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) setEvents(events.filter((e) => e.id !== id));
    setLoading(false);
  };

  // ✅ Remove post
  const removePost = async (id) => {
    setLoading(true);
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (!error) setPosts(posts.filter((p) => p.id !== id));
    setLoading(false);
  };

  return (
    <div className="admin-page">
      <h2>⚙️ Admin Dashboard</h2>
      <p className="subtitle">Manage events, posts, and stats</p>

      <div className="admin-grid">
        {/* Create Event */}
        <motion.div className="admin-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>📅 Create Event</h3>
          {/* form inputs */}
          <input type="text" placeholder="Title" value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} />
          <input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
          <input type="time" value={newEvent.time} onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })} />
          <input type="text" placeholder="Venue" value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })} />
          <input type="text" placeholder="Type" value={newEvent.type} onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })} />
          <input type="text" placeholder="Category" value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })} />
          <input type="number" placeholder="Spots Left" value={newEvent.spots_left} onChange={(e) => setNewEvent({ ...newEvent, spots_left: e.target.value })} />
          <input type="text" placeholder="Organizer" value={newEvent.organizer} onChange={(e) => setNewEvent({ ...newEvent, organizer: e.target.value })} />
          <input type="text" placeholder="Image Path" value={newEvent.image_path} onChange={(e) => setNewEvent({ ...newEvent, image_path: e.target.value })} />

          <button onClick={addEvent} disabled={loading}>
            {loading ? "Adding..." : "Add Event"}
          </button>
        </motion.div>

        {/* Manage Events */}
        <motion.div className="admin-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>🗂 Manage Events</h3>
          {events.length === 0 && <p>No events yet</p>}
          {events.map((ev) => (
            <div key={ev.id} className="list-item">
              <span>{ev.title} — {ev.date} at {ev.time} ({ev.category})</span>
              <button className="danger-btn" onClick={() => removeEvent(ev.id)}>Remove</button>
            </div>
          ))}
        </motion.div>

        {/* Manage Posts */}
        <motion.div className="admin-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>💬 Manage Posts</h3>
          {posts.length === 0 && <p>No posts yet</p>}
          {posts.map((p) => (
            <div key={p.id} className="list-item">
              <span><strong>{p.profiles?.name || "Anonymous"}:</strong> {p.title} — {p.content}</span>
              <button className="danger-btn" onClick={() => removePost(p.id)}>Delete</button>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div className="admin-card stats-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h3>📊 Stats</h3>
          <p>Total Events: {events.length}</p>
          <p>Total Posts: {posts.length}</p>
          <p>Total Users: {users.length}</p>
          <p>Active Categories: {new Set(events.map((e) => e.category)).size}</p>
          <p>Spots Remaining Across All Events: {events.reduce((sum, e) => sum + (e.spots_left || 0), 0)}</p>
        </motion.div>
      </div>
    </div>
  );
}
