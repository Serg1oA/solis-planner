"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePlanning, useSavePlanning } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import { TextArea } from "@/components/fields";

export default function PlanningPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = usePlanning(id);
  const { mutate: save, isPending } = useSavePlanning(id);

  const [scope,     setScope]     = useState("");
  const [timeline,  setTimeline]  = useState("");
  const [risks,     setRisks]     = useState("");
  const [resources, setResources] = useState("");
  const [isDirty,   setIsDirty]   = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setScope(data.scope ?? "");
      setTimeline(data.timeline ?? "");
      setRisks(data.risks ?? "");
      setResources(data.resources ?? "");
    }
  }, [data]);

  function handleSave() {
    save({ scope, timeline, risks, resources }, {
      onSuccess: () => { setIsDirty(false); setLastSaved(new Date().toISOString()); },
    });
  }

  if (isLoading) return <div className="animate-pulse flex flex-col gap-5">{[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-stone-900 border border-stone-800 rounded-xl" />)}</div>;

  return (
    <TabShell
      title="Planning"
      description="Define scope, timeline, risks, and resources needed."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <TextArea label="Scope" hint="What is in and out of scope for this project?" value={scope} onChange={(v) => { setScope(v); setIsDirty(true); }} rows={4} placeholder="e.g. Includes frontend redesign, excludes backend migration…" />
      <TextArea label="Timeline" hint="Key milestones and deadlines." value={timeline} onChange={(v) => { setTimeline(v); setIsDirty(true); }} rows={4} placeholder="e.g. Week 1: Discovery, Week 3: Design, Week 6: Launch…" />
      <TextArea label="Risks" hint="What could go wrong? How will you mitigate it?" value={risks} onChange={(v) => { setRisks(v); setIsDirty(true); }} rows={4} placeholder="e.g. Key developer unavailability — mitigation: cross-train team…" />
      <TextArea label="Resources" hint="People, tools, budget allocation, and dependencies." value={resources} onChange={(v) => { setResources(v); setIsDirty(true); }} rows={4} placeholder="e.g. 2 devs, 1 designer, Figma, AWS…" />
    </TabShell>
  );
}