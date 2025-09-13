import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./store/supaBaseClient";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current session on first load
    supabase.auth.getSession().then(({ data }) => {
      setUser(data?.session?.user ?? null);
    });

    // Listen for changes (login, logout, refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
