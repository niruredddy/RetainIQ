import { useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext } from "@/lib/auth-context";
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [recovery, setRecovery] = useState(false);
  const previousUser = useRef<string | null>(null);
  const cache = useQueryClient();
  useEffect(() => {
    let active = true;
    let received = false;
    const apply = (next: Session | null) => {
      if (!active) return;
      const id = next?.user.id ?? null;
      if (previousUser.current !== id) cache.clear();
      previousUser.current = id;
      setSession(next);
      setLoading(false);
    };
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, next) => {
      received = true;
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
      if (event === "SIGNED_OUT") setRecovery(false);
      apply(next);
    });
    void supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!received) apply(data.session);
      })
      .catch(() => {
        if (!received) apply(null);
      });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [cache]);
  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message ?? null };
  }, []);
  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { error: error?.message ?? null };
    },
    [],
  );
  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    cache.clear();
  }, [cache]);
  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        recovery,
        finishRecovery: () => setRecovery(false),
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
