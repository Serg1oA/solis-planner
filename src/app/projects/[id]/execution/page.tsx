"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useExecution, useSaveExecution } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import BlockBuilder from "@/components/blocks/BlockBuilder";
import type { Block } from "@/components/blocks/types";

export default function ExecutionPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useExecution(id);
  const { mutate: save, isPending } = useSaveExecution(id);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [completion, setCompletion] = useState(0);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setBlocks(data.blocks || []);
      setCompletion(data.completion_percentage ?? 0);
      setLastSaved(data ? new Date().toISOString() : null);
    }
  }, [data]);

  function handleSave() {
    save({ blocks, completion_percentage: completion }, {
      onSuccess: () => { setIsDirty(false); setLastSaved(new Date().toISOString()); },
    });
  }

  if (isLoading) {
    return (
      <div className="animate-pulse flex flex-col gap-5">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-40 neu-inset" />
        ))}
      </div>
    );
  }

  return (
    <TabShell
      title="Execution"
      description="Track progress, surface blockers, and monitor completion."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          Completion — <span className="text-amber-800 font-bold">{completion}%</span>
        </label>
        <p className="text-muted text-xs mb-3">Drag to update overall project progress.</p>
        <div className="relative">
          <input
            type="range"
            min={0}
            max={100}
            value={completion}
            onChange={(e) => { setCompletion(Number(e.target.value)); setIsDirty(true); }}
            className="w-full accent-amber-600 cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-2 mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
        <div className="mt-3 h-2 bg-shadow/50 rounded-full overflow-hidden shadow-neu-inset">
          <div
            className="h-full bg-amber-600 rounded-full transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <div className="neu-divider my-4" />

      <BlockBuilder
        blocks={blocks}
        onChange={(newBlocks) => {
          setBlocks(newBlocks);
          setIsDirty(true);
        }}
      />
    </TabShell>
  );
}
