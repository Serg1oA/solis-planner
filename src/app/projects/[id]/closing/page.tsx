"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useClosing, useSaveClosing } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import BlockBuilder from "@/components/blocks/BlockBuilder";
import type { Block } from "@/components/blocks/types";

export default function ClosingPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useClosing(id);
  const { mutate: save, isPending } = useSaveClosing(id);

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setBlocks(data.blocks || []);
      setLastSaved(data ? new Date().toISOString() : null);
    }
  }, [data]);

  function handleSave() {
    save(
      { blocks, closed_at: new Date().toISOString() },
      { onSuccess: () => { setIsDirty(false); setLastSaved(new Date().toISOString()); } }
    );
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
      title="Closing"
      description="Document deliverables, capture lessons learned, and formally close the project."
      onSave={handleSave}
      isSaving={isPending}
      isDirty={isDirty}
      lastSaved={lastSaved}
    >
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
