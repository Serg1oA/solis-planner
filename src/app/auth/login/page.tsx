"use client";

import { useState } from "react";
import { login, signup } from "@/app/auth/actions";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const result = mode === "login" ? await login(fd) : await signup(fd);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between bg-surface shadow-neu-sm">
        <span className="text-xl font-bold tracking-tight text-ink font-mono">
          Solis <span className="text-amber-700">Planner</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={`text-sm px-4 py-1.5 rounded-full transition-shadow font-medium bg-surface ${
              mode === "login"
                ? "shadow-neu-inset text-ink"
                : "shadow-neu-sm hover:shadow-neu text-muted hover:text-ink"
            }`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("signup"); setError(null); }}
            className={`text-sm px-4 py-1.5 rounded-full transition-shadow font-medium bg-surface ${
              mode === "signup"
                ? "shadow-neu-inset text-ink"
                : "shadow-neu-sm hover:shadow-neu text-muted hover:text-ink"
            }`}
          >
            Sign up
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        <div className="flex-1 flex flex-col justify-center px-10 py-16 lg:px-20 lg:py-0 relative">
          <div
            className="absolute inset-0 lg:w-1/2 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(31,42,28,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(31,42,28,0.32) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative max-w-lg">
            <div className="inline-flex items-center gap-2 bg-surface shadow-neu-inset rounded-full px-3 py-1 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              <span className="text-amber-800 text-xs font-medium tracking-wide">Project lifecycle management</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-ink leading-[1.1] tracking-tight mb-6">
              From idea<br />
              to <span className="text-amber-800">delivery.</span>
            </h1>

            <p className="text-muted text-lg leading-relaxed mb-10">
              A focused workspace for managing projects through every phase —
              initiation, planning, execution, and closing.
            </p>

            <div className="flex flex-wrap gap-2">
              {["Initiation", "Planning", "Execution", "Closing"].map((phase, i) => (
                <span
                  key={phase}
                  className="flex items-center gap-2 bg-surface shadow-neu-sm rounded-full px-4 py-1.5 text-sm text-ink"
                >
                  <span className="text-amber-800 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {phase}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12 lg:py-0">
          <div className="w-full max-w-sm neu-panel p-8">
            <h2 className="text-2xl font-bold text-ink mb-1">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-muted text-sm mb-8">
              {mode === "login"
                ? "For quick testing, login with almeida.sergiomc@gmail.com | test123"
                : "Create your free account."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full neu-input px-4 py-3 text-sm"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full neu-input px-4 py-3 text-sm"
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                />
              </div>

              {error && (
                <div className="neu-inset px-4 py-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full neu-button px-4 py-3 text-sm font-bold text-amber-900 mt-2"
              >
                {loading
                  ? mode === "login" ? "Signing in…" : "Creating account…"
                  : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="text-center text-muted-2 text-sm mt-6">
              {mode === "login" ? "No account? " : "Already have one? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                className="text-amber-800 hover:text-amber-700 transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
