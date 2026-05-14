"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useInitiation, useSaveInitiation } from "@/lib/queries/tabs";
import TabShell from "@/components/TabShell";
import BlockBuilder from "@/components/blocks/BlockBuilder";
import type { Block } from "@/components/blocks/types";

export default function InitiationPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useInitiation(id);
  const { mutate: save, isPending } = useSaveInitiation(id);

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
      { blocks },
      {
        onSuccess: () => {
          setIsDirty(false);
          setLastSaved(new Date().toISOString());
        },
      }
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
      title="Initiation"
      description="Define the project's purpose, stakeholders, and initial feasibility."
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
