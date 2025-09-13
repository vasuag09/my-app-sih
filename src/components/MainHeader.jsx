import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./MainHeader.css";
import logo from "../assets/MainLogo/logo.png"; // update if your logo path differs

export default function MainHeader({ onOpenSignIn, onOpenSignUp }) {
  return (
    <header className="mc-header">
      <div className="mc-inner">
        <div className="mc-left">
          <Link to="/" className="mc-brand">
            <img src={logo} alt="AlumniConnect" className="mc-logo" />
            <span className="mc-title">AlumConnect</span>
          </Link>
        </div>

        {/* <div className="mc-center">
          <label htmlFor="mc-search" className="mc-search-wrap" aria-hidden>
            <svg className="mc-search-icon" viewBox="0 0 24 24" width="18" height="18">
              <path fill="currentColor" d="M21 21l-4.35-4.35M10.5 18A7.5 7.5 0 1 1 10.5 3a7.5 7.5 0 0 1 0 15z" />
            </svg>
            <input
              id="mc-search"
              type="search"
              placeholder="Search alumni, events, or resources..."
              className="mc-search"
              aria-label="Search alumni, events, or resources"
            />
          </label>
        </div> */}
        <div className="mc-right">
          {/* Use a button to open modal instead of navigating */}
          <button
            className="mc-signin"
            onClick={(e) => {
              e.preventDefault(); // prevents any default behavior if in an anchor-like element
              onOpenSignIn?.();
            }}
          >
            Sign In
          </button>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <button
              className="mc-cta"
              onClick={(e) => {
                e.preventDefault();
                onOpenSignUp?.();
              }}
            >
              Join Network
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
