import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Helper function to apply the pending name from localStorage
    const syncUsername = async (currentUser) => {
      const pendingName = localStorage.getItem('pending_username');
      if (currentUser && pendingName) {
        // If the user's current metadata name is missing or "Student", we update it
        if (!currentUser.user_metadata?.full_name || currentUser.user_metadata.full_name === 'Student') {
          await supabase.auth.updateUser({
            data: { full_name: pendingName }
          });
        }
        localStorage.removeItem('pending_username'); // Clear it after use
      }
    };

    // 2. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) syncUsername(session.user);
      setLoading(false);
    });

    // 3. Listen for auth changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (event === 'SIGNED_IN' && session?.user) syncUsername(session.user);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
