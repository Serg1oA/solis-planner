"use client";

import { useState } from "react";
import { login, signup } from "@/app/auth/actions";
import Link from "next/link";

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
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Nav */}
      <header className="px-8 py-5 flex items-center justify-between border-b border-stone-900">
        <span className="text-xl font-bold tracking-tight text-white font-mono">
          proj<span className="text-amber-400">.</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setMode("login"); setError(null); }}
            className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${mode === "login" ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-300"}`}
          >
            Sign in
          </button>
          <button
            onClick={() => { setMode("signup"); setError(null); }}
            className={`text-sm px-4 py-1.5 rounded-lg transition-colors font-medium ${mode === "signup" ? "bg-stone-800 text-white" : "text-stone-500 hover:text-stone-300"}`}
          >
            Sign up
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1">
        {/* Hero — left side */}
        <div className="flex-1 flex flex-col justify-center px-10 py-16 lg:px-20 lg:py-0">
          {/* Decorative grid */}
          <div className="absolute inset-0 lg:w-1/2 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div className="relative max-w-lg">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 rounded-full px-3 py-1 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-amber-400 text-xs font-medium tracking-wide">Project lifecycle management</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              From idea<br />
              to <span className="text-amber-400">delivery.</span>
            </h1>

            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              A focused workspace for managing projects through every phase —
              initiation, planning, execution, and closing.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2">
              {["Initiation", "Planning", "Execution", "Closing"].map((phase, i) => (
                <span
                  key={phase}
                  className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-full px-4 py-1.5 text-sm text-stone-300"
                >
                  <span className="text-amber-400 font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                  {phase}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Auth form — right side */}
        <div className="w-full lg:w-[480px] flex items-center justify-center px-8 py-12 lg:py-0 border-t lg:border-t-0 lg:border-l border-stone-800">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold text-white mb-1">
              {mode === "login" ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-stone-500 text-sm mb-8">
              {mode === "login"
                ? "Sign in to your workspace."
                : "Create your free account."}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-stone-400 mb-1.5">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm text-stone-400 mb-1.5">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-3 text-white text-sm placeholder-stone-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                  placeholder={mode === "signup" ? "Min. 6 characters" : "••••••••"}
                />
              </div>

              {error && (
                <div className="bg-red-950 border border-red-800 rounded-xl px-4 py-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-bold rounded-xl px-4 py-3 text-sm transition-colors mt-2"
              >
                {loading
                  ? mode === "login" ? "Signing in…" : "Creating account…"
                  : mode === "login" ? "Sign in" : "Create account"}
              </button>
            </form>

            <p className="text-center text-stone-600 text-sm mt-6">
              {mode === "login" ? "No account? " : "Already have one? "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                className="text-amber-400 hover:text-amber-300 transition-colors"
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