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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-ink">{title}</h2>
          <p className="text-muted text-sm mt-1">{description}</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {lastSaved && (
            <span className="text-muted-2 text-xs hidden sm:block">
              Saved {new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            onClick={onSave}
            disabled={isSaving || !isDirty}
            className="neu-button px-4 py-2 text-sm font-semibold text-amber-900"
          >
            {isSaving ? "Saving…" : isDirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {children}
      </div>
    </div>
  );
}
