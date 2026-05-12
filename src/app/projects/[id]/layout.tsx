"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { logout } from "@/app/auth/actions";
import { useProjects } from "@/lib/queries/projects";

const TABS = [
  { label: "Initiation", slug: "initiation" },
  { label: "Planning",   slug: "planning"   },
  { label: "Execution",  slug: "execution"  },
  { label: "Closing",    slug: "closing"    },
];

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const { data: projects } = useProjects();
  const project = projects?.find((p) => p.id === id);

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top navbar */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-stone-500 hover:text-stone-300 transition-colors text-sm"
          >
            ← Projects
          </Link>
          <span className="text-stone-700">/</span>
          <span className="text-white font-medium text-sm truncate max-w-[200px]">
            {project?.name ?? "Loading…"}
          </span>
        </div>

        <button
          onClick={() => logout()}
          className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
        >
          Sign out
        </button>
      </header>

      {/* Tab bar */}
      <nav className="border-b border-stone-800 px-6 shrink-0">
        <div className="flex gap-1 max-w-5xl mx-auto">
          {TABS.map((tab) => {
            const href = `/projects/${id}/${tab.slug}`;
            const active = pathname === href;
            return (
              <Link
                key={tab.slug}
                href={href}
                className={`relative px-4 py-3.5 text-sm font-medium transition-colors ${
                  active
                    ? "text-amber-400"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {tab.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  );
}