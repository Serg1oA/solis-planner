"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/app/auth/actions";
import { useProjects, useDeleteProject, useUpdateProject, type Project } from "@/lib/queries/projects";
import CreateProjectModal from "@/components/CreateProjectModal";

const STATUS_COLORS = {
  active: "text-emerald-700",
  completed: "text-blue-700",
  archived: "text-muted-2",
};

function ProjectCard({ project }: { project: Project }) {
  const { mutate: deleteProject } = useDeleteProject();
  const { mutate: updateProject } = useUpdateProject();
  const [confirming, setConfirming] = useState(false);

  const statusOptions: Project["status"][] = ["active", "completed", "archived"];

  return (
    <div className="group neu-card p-5 flex flex-col gap-4 transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-ink font-semibold text-base truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-muted text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        <select
          value={project.status}
          onChange={(e) =>
            updateProject({ id: project.id, status: e.target.value as Project["status"] })
          }
          className={`shrink-0 text-xs px-3 py-1 rounded-full font-medium cursor-pointer neu-input ${STATUS_COLORS[project.status]}`}
        >
          {statusOptions.map((s) => (
            <option key={s} value={s} className="bg-surface text-ink">
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-auto pt-2">
        <div className="neu-divider" />
        <div className="flex items-center justify-between pt-3">
          <span className="text-muted-2 text-xs">
            {new Date(project.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </span>

          <div className="flex items-center gap-2">
            {confirming ? (
              <>
                <button
                  onClick={() => setConfirming(false)}
                  className="text-xs text-muted hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="text-xs text-red-700 hover:text-red-600 transition-colors font-medium"
                >
                  Confirm delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setConfirming(true)}
                  className="text-xs text-muted-2 hover:text-red-700 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
                <Link
                  href={`/projects/${project.id}/initiation`}
                  className="neu-button text-xs rounded-lg px-3 py-1.5 transition-shadow font-medium text-ink inline-flex items-center"
                >
                  Open →
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-surface shadow-neu-sm px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight text-ink font-mono">
          Solis <span className="text-amber-700">Planner</span>
        </span>
        <button
          onClick={() => logout()}
          className="text-sm text-muted hover:text-ink transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-ink">Your projects</h1>
            <p className="text-muted text-sm mt-1">
              {projects?.length ?? 0} project{projects?.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="neu-button px-4 py-2.5 text-sm font-semibold text-amber-900"
          >
            + New project
          </button>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="neu-card p-5 h-36 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="neu-inset p-4 text-red-700 text-sm">
            Failed to load projects: {(error as Error).message}
          </div>
        )}

        {!isLoading && !error && projects?.length === 0 && (
          <div className="neu-inset text-center py-24">
            <p className="text-muted text-lg mb-2">No projects yet</p>
            <p className="text-muted-2 text-sm mb-6">
              Create your first project to get started
            </p>
            <button
              onClick={() => setModalOpen(true)}
              className="neu-button px-5 py-2.5 text-sm font-semibold text-amber-900"
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
