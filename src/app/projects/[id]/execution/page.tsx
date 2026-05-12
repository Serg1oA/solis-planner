"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useExecution, useSaveExecution } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import { TextArea } from "@/components/fields";

export default function ExecutionPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useExecution(id);
  const { mutate: save, isPending } = useSaveExecution(id);

  const [progressNotes, setProgressNotes] = useState("");
  const [blockers,      setBlockers]      = useState("");
  const [completion,    setCompletion]    = useState(0);
  const [isDirty,       setIsDirty]       = useState(false);
  const [lastSaved,     setLastSaved]     = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setProgressNotes(data.progress_notes ?? "");
      setBlockers(data.blockers ?? "");
      setCompletion(data.completion_percentage ?? 0);
    }
  }, [data]);

  function handleSave() {
    save({ progress_notes: progressNotes, blockers, completion_percentage: completion }, {
      onSuccess: () => { setIsDirty(false); setLastSaved(new Date().toISOString()); },
    });
  }

  if (isLoading) return <div className="animate-pulse flex flex-col gap-5">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-stone-900 border border-stone-800 rounded-xl" />)}</div>;

  return (
    <TabShell
      title="Execution"
      description="Track progress, surface blockers, and monitor completion."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      {/* Completion slider */}
      <div>
        <label className="block text-sm font-medium text-stone-300 mb-1">
          Completion — <span className="text-amber-400 font-bold">{completion}%</span>
        </label>
        <p className="text-stone-500 text-xs mb-3">Drag to update overall project progress.</p>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={completion}
            onChange={(e) => { setCompletion(Number(e.target.value)); setIsDirty(true); }}
            className="w-full accent-amber-400 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-stone-600 mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-2 bg-stone-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <TextArea label="Progress notes" hint="What has been completed so far?" value={progressNotes} onChange={(v) => { setProgressNotes(v); setIsDirty(true); }} rows={5} placeholder="e.g. Completed API integration, deployed to staging…" />
      <TextArea label="Blockers" hint="What is slowing things down or needs resolution?" value={blockers} onChange={(v) => { setBlockers(v); setIsDirty(true); }} rows={4} placeholder="e.g. Waiting on client approval for design assets…" />
    </TabShell>
  );
}