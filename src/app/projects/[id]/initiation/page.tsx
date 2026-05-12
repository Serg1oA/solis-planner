"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInitiation, useSaveInitiation } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import { TextArea, NumberField } from "@/components/fields";

export default function InitiationPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useInitiation(id);
  const { mutate: save, isPending } = useSaveInitiation(id);

  const [objectives,       setObjectives]      = useState("");
  const [stakeholders,     setStakeholders]    = useState("");
  const [feasibilityNotes, setFeasibilityNotes]= useState("");
  const [budgetEstimate,   setBudgetEstimate]  = useState("");
  const [isDirty,          setIsDirty]         = useState(false);
  const [lastSaved,        setLastSaved]       = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setObjectives(data.objectives ?? "");
      setStakeholders(data.stakeholders ?? "");
      setFeasibilityNotes(data.feasibility_notes ?? "");
      setBudgetEstimate(data.budget_estimate?.toString() ?? "");
      setLastSaved(data ? new Date().toISOString() : null);
    }
  }, [data]);

  function markDirty(fn: () => void) { return (...args: unknown[]) => { (fn as (...a: unknown[]) => void)(...args); setIsDirty(true); }; }

  function handleSave() {
    save(
      {
        objectives,
        stakeholders,
        feasibility_notes: feasibilityNotes,
        budget_estimate: budgetEstimate ? parseFloat(budgetEstimate) : null,
      },
      {
        onSuccess: () => {
          setIsDirty(false);
          setLastSaved(new Date().toISOString());
        },
      }
    );
  }

  if (isLoading) return <TabSkeleton />;

  return (
    <TabShell
      title="Initiation"
      description="Define the project's purpose, stakeholders, and initial feasibility."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <TextArea
        label="Objectives"
        hint="What are the goals and expected outcomes of this project?"
        value={objectives}
        onChange={(v) => { setObjectives(v); setIsDirty(true); }}
        placeholder="e.g. Launch a new e-commerce platform by Q3…"
        rows={5}
      />
      <TextArea
        label="Stakeholders"
        hint="Who are the key people involved or affected?"
        value={stakeholders}
        onChange={(v) => { setStakeholders(v); setIsDirty(true); }}
        placeholder="e.g. Product team, Marketing, External client…"
        rows={4}
      />
      <TextArea
        label="Feasibility notes"
        hint="Any constraints, risks, or considerations at this stage?"
        value={feasibilityNotes}
        onChange={(v) => { setFeasibilityNotes(v); setIsDirty(true); }}
        rows={4}
      />
      <NumberField
        label="Budget estimate (€)"
        hint="Rough initial budget in your preferred currency."
        value={budgetEstimate}
        onChange={(v) => { setBudgetEstimate(v); setIsDirty(true); }}
        placeholder="e.g. 25000"
        min={0}
      />
    </TabShell>
  );
}

function TabSkeleton() {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {[5, 4, 4].map((rows, i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-stone-800 rounded" />
          <div className={`bg-stone-900 border border-stone-800 rounded-xl`} style={{ height: rows * 24 + 24 }} />
        </div>
      ))}
    </div>
  );
}