"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useClosing, useSaveClosing } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import { TextArea } from "@/components/fields";

export default function ClosingPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useClosing(id);
  const { mutate: save, isPending } = useSaveClosing(id);

  const [deliverables,    setDeliverables]   = useState("");
  const [lessonsLearned,  setLessonsLearned] = useState("");
  const [finalNotes,      setFinalNotes]     = useState("");
  const [isDirty,         setIsDirty]        = useState(false);
  const [lastSaved,       setLastSaved]      = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setDeliverables(data.deliverables ?? "");
      setLessonsLearned(data.lessons_learned ?? "");
      setFinalNotes(data.final_notes ?? "");
    }
  }, [data]);

  function handleSave() {
    save(
      { deliverables, lessons_learned: lessonsLearned, final_notes: finalNotes, closed_at: new Date().toISOString() },
      { onSuccess: () => { setIsDirty(false); setLastSaved(new Date().toISOString()); } }
    );
  }

  if (isLoading) return <div className="animate-pulse flex flex-col gap-5">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-stone-900 border border-stone-800 rounded-xl" />)}</div>;

  return (
    <TabShell
      title="Closing"
      description="Document deliverables, capture lessons learned, and formally close the project."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <TextArea label="Deliverables" hint="What was produced and handed over?" value={deliverables} onChange={(v) => { setDeliverables(v); setIsDirty(true); }} rows={4} placeholder="e.g. Live website, documentation, trained team…" />
      <TextArea label="Lessons learned" hint="What went well? What would you do differently?" value={lessonsLearned} onChange={(v) => { setLessonsLearned(v); setIsDirty(true); }} rows={5} placeholder="e.g. Earlier client check-ins would have saved revision cycles…" />
      <TextArea label="Final notes" hint="Anything else worth recording before closing." value={finalNotes} onChange={(v) => { setFinalNotes(v); setIsDirty(true); }} rows={4} placeholder="e.g. Project archived in Drive, client signed off on 12 Jan…" />
    </TabShell>
  );
}