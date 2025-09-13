import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import "./Sidebar.css";
import logo from "../assets/MainLogo/logo.png";
import { useSelector } from "react-redux";

export default function Sidebar() {
  const user = useSelector((state) => state.user.user);

  const items = [
    { to: `/${user?.id}/app`, label: "Dashboard", icon: "📊" },
    { to: `/${user?.id}/app/forum`, label: "Forum", icon: "💬" },
    { to: `/${user?.id}/app/connections`, label: "Connections", icon: "🧑‍🦯‍➡️" },
    { to: `/${user?.id}/app/events`, label: "Events", icon: "🗓️" },
    { to: `/${user?.id}/app/events-calender`, label: "Events Calender", icon: "📅" },
    { to: `/${user?.id}/app/chatroom`, label: "ChatRoom", icon: "📋" },
    { to: `/${user?.id}/app/alumni-map`, label: "Alumni Map", icon: "🗺️" },
    { to: `/${user?.id}/app/profile`, label: "User Profile", icon: "👤" },
  ];

  return (
    <motion.aside
      className="sidebar"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.36 }}
      aria-label="Main navigation"
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          {" "}
          <img src={logo} alt="" style={{ width: "30px" }} />
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
            end
          >
            <span className="sidebar-ic">{it.icon}</span>
            <span className="sidebar-label">{it.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <small className="sidebar-foot">
          © {new Date().getFullYear()} AlumConnect
        </small>
      </div>
    </motion.aside>
  );
}
