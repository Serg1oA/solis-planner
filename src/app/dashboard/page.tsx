"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { useProjects, useDeleteProject, useUpdateProject, type Project } from "@/lib/queries/projects";
import CreateProjectModal from "@/components/CreateProjectModal";

const STATUS_COLORS = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  archived: "bg-stone-500/10 text-stone-400 border-stone-500/20",
};

function ProjectCard({ project }: { project: Project }) {
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: updateProject } = useUpdateProject();
  const [confirming, setConfirming] = useState(false);

  const statusOptions: Project["status"][] = ["active", "completed", "archived"];

  return (
    <div className="group bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 flex flex-col gap-4 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-stone-400 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Inline status selector */}
        <select
          value={project.status}
          onChange={(e) =>
            updateProject({ id: project.id, status: e.target.value as Project["status"] })
          }
          className={`shrink-0 text-xs px-2 py-0.5 rounded-full border font-medium cursor-pointer bg-transparent focus:outline-none transition-colors ${STATUS_COLORS[project.status]}`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-stone-900 text-white">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-stone-800">
        <span className="text-stone-500 text-xs">
          {new Date(project.created_at).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })}
        </span>

        <div className="flex items-center gap-2">
          {confirming ? (
            <>
              <button
                onClick={() => setConfirming(false)}
                className="text-xs text-stone-400 hover:text-stone-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteProject(project.id)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
              >
                Confirm delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirming(true)}
                className="text-xs text-stone-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                Delete
              </button>
              <Link
                href={`/projects/${project.id}/initiation`}
                className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg px-3 py-1.5 transition-colors font-medium"
              >
                Open →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Navbar */}
      <header className="border-b border-stone-800 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-white font-mono">
          proj<span className="text-amber-400">.</span>
        </span>
        <button
          onClick={() => logout()}
          className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Your projects</h1>
            <p className="text-stone-500 text-sm mt-1">
              {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors"
          >
            + New project
          </button>
        </div>

        {/* States */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 h-36 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 text-red-400 text-sm">
            Failed to load projects: {(error as Error).message}
          </div>
        )}

        {!isLoading && !error && projects?.length === 0 && (
          <div className="text-center py-24 border border-dashed border-stone-800 rounded-2xl">
            <p className="text-stone-500 text-lg mb-2">No projects yet</p>
            <p className="text-stone-600 text-sm mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold rounded-xl px-5 py-2.5 text-sm transition-colors"
            >
              + New project
            </button>
          </div>
        )}

        {!isLoading && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}