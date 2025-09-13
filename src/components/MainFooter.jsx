import React from "react";
import "./MainFooter.css";

export default function MainFooter() {
  return (
    <>
      <footer className="mf-footer">
        <div className="mf-inner">
          <div className="mf-col">
            <h4>AlumConnect</h4>
            <p className="mf-muted">Connecting alumni and students worldwide — mentorship, events, and opportunities.</p>
          </div>

          <div className="mf-links">
            <div>
              <h5>Product</h5>
              <a href="/directory">Directory</a>
              <a href="/events">Events</a>
              <a href="/mentorship">Mentorship</a>
            </div>

            <div>
              <h5>Company</h5>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
              <a href="/privacy">Privacy</a>
            </div>
          </div>

          <div className="mf-right">
            <h5>Stay in touch</h5>
            <small className="mf-muted">Subscribe for product updates and events.</small>
            <form className="mf-sub">
              <input placeholder="Email address" aria-label="subscribe email" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="mf-bottom">
          <small>© {new Date().getFullYear()} AlumConnect · Built with ❤️</small>
        </div>
      </footer>

      {/* floating chat/help button */}
      <a className="mf-chat" href="/help" aria-label="Open chat">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M21 12c0 4.97-4.03 9-9 9-1.9 0-3.67-.57-5.18-1.55L3 21l1.53-3.82C3.6 15.25 3 13.67 3 12 3 7.03 7.03 3 12 3s9 4.03 9 9z"/></svg>
      </a>
    </>
  );
}
