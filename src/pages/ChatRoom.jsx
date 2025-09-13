import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import "./ChatRoom.css";

const socket = io("http://localhost:3000");

const CHANNELS = [
  { id: "general", name: "General" },
  { id: "jobs", name: "Job Opportunities" },
  { id: "networking", name: "Networking" },
  { id: "tech", name: "Tech Talk" },
  { id: "events", name: "Events & Meetups" },
];

// Generate a random pastel background color for avatars
function getAvatarColor(name) {
  const colors = [
    "#f87171",
    "#fbbf24",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#f472b6",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function ChatRoom() {
  const user = useSelector((state) => state.user.user);
  const username =
    user?.user_metadata?.name || user?.user_metadata?.email || "Anonymous";
  const userId = user?.id;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeChannel, setActiveChannel] = useState("general");

  useEffect(() => {
    if (!activeChannel) return;
    fetch(`http://localhost:3000/api/messages?channel=${activeChannel}`)
      .then((res) => res.json())
      .then((data) =>
        setMessages(
          data.map((m) => ({
            user: m.username,
            text: m.content,
            created_at: m.created_at,
            channel: m.channel,
          }))
        )
      );
  }, [activeChannel]);

  useEffect(() => {
    if (username && userId) {
      socket.emit("join", { username, userId, channel: activeChannel });
    }
  }, [username, userId, activeChannel]);

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      if (msg.channel === activeChannel) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("userList", (list) => {
      setUsers(list);
    });

    return () => {
      socket.off("chatMessage");
      socket.off("userList");
    };
  }, [activeChannel]);

  function handleSend(e) {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", {
        text: message,
        user: username,
        channel: activeChannel,
      });
      setMessage("");
    }
  }

  return (
    <div className="chatroom-container">
      {/* Sidebar */}
      <motion.aside
        className="chatroom-sidebar"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3>Channels</h3>
        <ul className="channel-list">
          {CHANNELS.map((ch) => (
            <motion.li
              key={ch.id}
              className={activeChannel === ch.id ? "active" : ""}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveChannel(ch.id)}
            >
              #{ch.name}
            </motion.li>
          ))}
        </ul>

        <h4>Online Users</h4>
        <motion.ul
          className="user-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {users.map((u, i) => (
            <motion.li key={i} whileHover={{ scale: 1.05 }}>
              <span
                className="user-avatar"
                style={{ backgroundColor: getAvatarColor(u) }}
              >
                {u.charAt(0).toUpperCase()}
              </span>
              {u}
            </motion.li>
          ))}
        </motion.ul>
      </motion.aside>

      {/* Chat Area */}
      <div className="chatroom-main">
        <h2 className="channel-header">#{activeChannel}</h2>

        <div className="chatroom-messages">
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                className={`message-wrapper ${
                  m.user === username ? "me" : "other"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Avatar */}
                <div
                  className="message-avatar"
                  style={{ backgroundColor: getAvatarColor(m.user) }}
                >
                  {m.user.charAt(0).toUpperCase()}
                </div>

                {/* Bubble */}
                <div className="message">
                  <span className="author">{m.user}</span>
                  <p>{m.text}</p>
                  <small>{new Date(m.created_at).toLocaleTimeString()}</small>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <form className="chatroom-input" onSubmit={handleSend}>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            Send
          </motion.button>
          <motion.input
            type="text"
            placeholder={`Message #${activeChannel}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            whileFocus={{ scale: 1.02 }}
          />
        </form>
      </div>
    </div>
  );
}
