"use client";

type Props = {
  title: string;
  description: string;
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved?: string | null;
  children: React.ReactNode;
};

export default function TabShell({
  title, description, onSave, isSaving, isDirty, lastSaved, children,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      {/* Tab header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-stone-500 text-sm mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {lastSaved && (
            <span className="text-stone-600 text-xs hidden sm:block">
              Saved {new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed text-stone-950 font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
          >
            {isSaving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}