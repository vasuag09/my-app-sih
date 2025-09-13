// Root.js
import React, { useState } from "react";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import { SignInModal, SignUpModal, ForgotPasswordModal } from "../components/AuthModals";
import { Outlet } from "react-router-dom";
export default function Root() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgot, setShowForgot] = useState(false);

  return (
    <>
      <MainHeader onOpenSignIn={() => setShowSignIn(true)} onOpenSignUp={() => setShowSignUp(true)} />
      <Outlet />
      <MainFooter />

      <SignInModal
        show={showSignIn}
        onClose={() => setShowSignIn(false)}
        onSuccess={(user) => console.log("signed in", user)}
        switchToSignUp={() => { setShowSignIn(false); setShowSignUp(true); }}
        switchToForgot={() => { setShowSignIn(false); setShowForgot(true); }}
      />

      <SignUpModal
        show={showSignUp}
        onClose={() => setShowSignUp(false)}
        onSuccess={(user) => console.log("signed up", user)}
        switchToSignIn={() => { setShowSignUp(false); setShowSignIn(true); }}
      />

      <ForgotPasswordModal
        show={showForgot}
        onClose={() => setShowForgot(false)}
        onSent={(info) => { console.log("reset sent", info); }}
        switchToSignIn={() => { setShowForgot(false); setShowSignIn(true); }}
      />
    </>
  );
}
