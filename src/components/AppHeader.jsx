import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AppHeader.css";
import { useNavigate } from "react-router-dom";
import logo from "../assets/MainLogo/logo.png";
import { useSelector } from "react-redux";
export default function AppHeader({
  user = { name: "User" },
  onSignOut = () => {},
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const userName = useSelector(state=>state.user.user.user_metadata.name)
  // close when clicking outside
  useEffect(() => {
    function onDoc(e) {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <header className="app-header">
      <div className="app-header-left">
        {/* <button className="app-toggle" aria-hidden>
          ☰
        </button> */}
        {/* <img src={logo} alt="" style={{width: "50px"}}/> */}
        <div className="app-title">AlumConnect</div>
      </div>

      <div className="app-header-right">
        <div
          className="app-notifs"
          title="Notifications"
          role="button"
          tabIndex={0}
        >
          🔔
        </div>

        <div className="profile-wrap" ref={menuRef}>
          <button
            className="profile-btn"
            onClick={() => setOpen((p) => !p)}
            aria-expanded={open}
            aria-haspopup="menu"
            type="button"
          >
            <span className="profile-avatar" aria-hidden>
              {" "}
              <img
                src={`https://ui-avatars.com/api/?name=${userName}&background=2c52e0&color=fff`}
                alt="profile"
                className="profile-pic"
              />
            </span>
            <span className="profile-name">{user.name}</span>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                className="profile-menu"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.18 }}
                role="menu"
              >
                <button
                  className="profile-item"
                  onClick={() => {
                    setOpen(false);
                    /* navigate to profile */ navigate(`profile`);
                  }}
                >
                  View Profile
                </button>
                <button
                  className="profile-item"
                  onClick={() => {
                    setOpen(false);
                    onSignOut();
                  }}
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
