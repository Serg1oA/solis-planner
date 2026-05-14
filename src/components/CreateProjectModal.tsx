"use client";

import { useEffect, useState } from "react";
import { useCreateProject } from "@/lib/queries/projects";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, isPending, error } = useCreateProject();

  useEffect(() => {
    if (open) { setName(""); setDescription(""); }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    mutate({ name: name.trim(), description: description.trim() }, { onSuccess: onClose });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="neu-panel w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-ink">New project</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-ink transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1.5">
              Project name <span className="text-amber-700">*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full neu-input px-4 py-2.5 text-sm"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-1.5">
              Description{" "}
              <span className="text-muted-2 text-xs">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full neu-input px-4 py-2.5 text-sm resize-none"
              placeholder="What is this project about?"
            />
          </div>

          {error && (
            <p className="text-red-700 text-sm">{(error as Error).message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="neu-button flex-1 px-4 py-2.5 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="neu-button flex-1 px-4 py-2.5 text-sm font-semibold text-amber-900"
            >
              {isPending ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
