import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Moon,
  Radar,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthArtwork } from "@/components/auth/auth-artwork";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

type Mode = "signin" | "signup" | "recover" | "reset";
const headings: Record<Mode, [string, string]> = {
  signin: ["Welcome back.", "Your people. Their potential. One clear picture."],
  signup: [
    "A better future starts here.",
    "Create your account and explore your workforce's potential.",
  ],
  recover: [
    "Let's get you back in.",
    "We'll send a password reset link to your email.",
  ],
  reset: [
    "Choose a new password.",
    "Keep your account protected with a strong password.",
  ],
};

export default function AuthPage() {
  const { user, loading, signIn, signUp, recovery, finishRecovery } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const requested = params.get("mode");
  const mode: Mode = recovery
    ? "reset"
    : requested === "signup" || requested === "recover" || requested === "reset"
      ? requested
      : "signin";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const from = (
    location.state as { from?: { pathname?: string; search?: string } } | null
  )?.from;
  const path = from?.pathname;
  const destination =
    path?.startsWith("/") && !path.startsWith("//") && !path.startsWith("/auth")
      ? `${path}${from?.search ?? ""}`
      : "/";
  if (!loading && user && mode !== "reset")
    return <Navigate to={destination} replace />;

  const switchMode = (next: Mode) => {
    if (submitting) return;
    setParams({ mode: next });
    setError(null);
    setMessage(null);
    setPassword("");
  };
  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "recover") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(
          email.trim(),
          { redirectTo: `${window.location.origin}/auth?mode=reset` },
        );
        if (err) throw err;
        setMessage(
          "If an account exists for this email, a reset link has been sent. Check your inbox.",
        );
      } else if (mode === "reset") {
        if (!user)
          throw new Error(
            "Open the reset link from your email to choose a new password.",
          );
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) throw err;
        finishRecovery();
        setParams({ mode: "signin" });
      } else {
        const result =
          mode === "signin"
            ? await signIn(email.trim(), password)
            : await signUp(email.trim(), password, fullName.trim());
        if (result.error) throw new Error(result.error);
        if (mode === "signup")
          setMessage(
            "Account created. If email confirmation is required, check your inbox before signing in.",
          );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  const busy = submitting || loading;
  return (
    <div className="auth-page">
      <header className="auth-header">
        <a href="/auth" className="brand-lockup" aria-label="RetainIQ home">
          <span className="brand-icon">
            <Radar size={22} strokeWidth={1.8} />
          </span>
          <span>
            Retain<span className="text-primary">IQ</span>
            <small>WORKFORCE INTELLIGENCE</small>
          </span>
        </a>
        <div className="flex items-center gap-5">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Built around people.
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </header>
      <main className="auth-layout">
        <AuthArtwork />
        <section className="auth-form-area" aria-labelledby="auth-title">
          <div className="auth-form-inner">
            <p className="section-kicker">YOUR NEXT CHAPTER</p>
            <h2 id="auth-title" className="auth-form-title">
              {headings[mode][0]}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {headings[mode][1]}
            </p>
            {(mode === "signin" || mode === "signup") && (
              <div
                className="auth-tabs"
                role="group"
                aria-label="Account access"
              >
                <button
                  type="button"
                  aria-pressed={mode === "signin"}
                  disabled={submitting}
                  onClick={() => switchMode("signin")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  aria-pressed={mode === "signup"}
                  disabled={submitting}
                  onClick={() => switchMode("signup")}
                >
                  Create account
                </button>
              </div>
            )}
            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="auth-label">
                    Full name
                  </label>
                  <Input
                    id="fullName"
                    required
                    maxLength={100}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    autoComplete="name"
                    disabled={busy}
                    className="auth-input"
                  />
                </div>
              )}
              {mode !== "reset" && (
                <div className="space-y-2">
                  <label htmlFor="email" className="auth-label">
                    Work email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    autoComplete="email"
                    disabled={busy}
                    className="auth-input"
                  />
                </div>
              )}
              {mode !== "recover" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="auth-label">
                      Password
                    </label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        className="auth-text-link"
                        disabled={submitting}
                        onClick={() => switchMode("recover")}
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={visible ? "text" : "password"}
                      required
                      minLength={mode === "signin" ? undefined : 8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={
                        mode === "signin"
                          ? "Enter your password"
                          : "At least 8 characters"
                      }
                      autoComplete={
                        mode === "signin" ? "current-password" : "new-password"
                      }
                      disabled={busy}
                      className="auth-input pr-12"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground hover:text-foreground"
                      aria-label={visible ? "Hide password" : "Show password"}
                      onClick={() => setVisible((v) => !v)}
                    >
                      {visible ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
              )}
              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
                >
                  {error}
                </p>
              )}
              {message && (
                <p
                  role="status"
                  className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-foreground"
                >
                  {message}
                </p>
              )}
              <Button type="submit" disabled={busy} className="auth-submit">
                {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                {busy
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Sign in to your workspace"
                    : mode === "signup"
                      ? "Create your account"
                      : mode === "recover"
                        ? "Send reset link"
                        : "Update password"}
                {!busy && <ArrowRight size={17} />}
              </Button>
            </form>
            {(mode === "recover" || mode === "reset") && (
              <button
                type="button"
                className="auth-text-link mt-5 flex items-center gap-2"
                onClick={() => {
                  finishRecovery();
                  switchMode("signin");
                }}
              >
                <ArrowLeft size={14} />
                Back to sign in
              </button>
            )}
            <div className="auth-form-foot">
              <LockKeyhole size={14} />
              <span>Your workspace starts with a secure sign-in.</span>
            </div>
            <div className="auth-principle">
              <span className="auth-principle-line" />
              <span>People-led. Intelligence-assisted.</span>
              <span className="auth-principle-line" />
            </div>
          </div>
        </section>
      </main>
      <footer className="auth-footer">
        <span>© {new Date().getFullYear()} RetainIQ</span>
        <span>See potential. Create possibilities.</span>
      </footer>
    </div>
  );
}
