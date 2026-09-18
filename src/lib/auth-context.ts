import { createContext } from "react";
import type { Session, User } from "@supabase/supabase-js";
interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  recovery: boolean;
  finishRecovery: () => void;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}
// Separate from the refreshable provider so live edits retain context identity.
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
