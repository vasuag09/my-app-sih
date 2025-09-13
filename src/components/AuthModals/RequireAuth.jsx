import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../../store/supaBaseClient";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function RequireAuth({ children, redirectTo = "/" }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setLoading(false);
    }

    checkSession();

    // 🔄 Listen for changes (login / logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />; // or your spinner
  }

  if (!session) {
    // not logged in
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return children;
}
