"use client";

import { useState, useEffect } from "react";
import { useCreateProject } from "@/lib/queries/projects";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CreateProjectModal({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, isPending, error } = useCreateProject();

  // Reset form when modal opens
  useEffect(() => {
    if (open) { setName(""); setDescription(""); }
  }, [open]);

  // Close on Escape
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">New project</h2>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-300 transition-colors text-xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-stone-400 mb-1.5">
              Project name <span className="text-amber-400">*</span>
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              placeholder="e.g. Website Redesign"
            />
          </div>

          <div>
            <label className="block text-sm text-stone-400 mb-1.5">
              Description{" "}
              <span className="text-stone-600 text-xs">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-stone-800 border border-stone-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
              placeholder="What is this project about?"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{(error as Error).message}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed text-stone-950 font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
            >
              {isPending ? "Creating…" : "Create project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}