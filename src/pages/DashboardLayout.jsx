import React from "react";
import Sidebar from "../components/Sidebar";
import AppHeader from "../components/AppHeader";
import { Outlet, useNavigate } from "react-router-dom";
import "./DashboardLayout.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userActions } from "../store/userSlice";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user.user_metadata);
  const currentUser = { name: user?.name || "Account" };

  function handleSignOut() {
    dispatch(userActions.logout());
    navigate("/");
    console.log("Sign out clicked");
  }

  useEffect(() => {
    createChat({
      webhookUrl:
        "https://manav12.app.n8n.cloud/webhook/15c22f30-d03a-47b5-9dd0-ed856d4eac49/chat", // ✅ replace with your n8n webhook URL
      // leave target undefined → floating widget mode
      theme: {
        chatBubble: { background: "#4f46e5", textColor: "#fff" },
        launcher: { background: "#4f46e5" },
        header: { background: "#4f46e5", textColor: "#fff" },
      },
      position: "bottom-right", // can be "bottom-left"
      defaultOpen: false,
      initialMessages: [
        "Hi there! 👋 I’m AlumBot, your smart assistant",
        "I can help you explore events, connect with alumni, and answer any questions you have. What would you like to do today?",
      ],
      // keeps it closed until clicked
    });
  }, []);

  // if (!user) {
  //   return <Navigate to="/" replace />;
  // }
  // if (!user) {
  //   return <p>Loading user...</p>; // avoid crash
  // }
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="dashboard-main">
        <AppHeader user={currentUser} onSignOut={handleSignOut} />
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
