"use client";

import { useState } from "react";
import type { Block, BlockType } from "./types";
import TodoBlock from "./TodoBlock";
import CalendarBlock from "./CalendarBlock";
import TableBlock from "./TableBlock";

type Props = {
  blocks: Block[];
  onChange: (blocks: Block[]) => void;
};

export default function BlockBuilder({ blocks, onChange }: Props) {
  const [showAdd, setShowAdd] = useState<number | null>(null);

  function addBlock(type: BlockType, index: number) {
    const newBlock: Block =
      type === "todo"
        ? { id: crypto.randomUUID(), type: "todo", data: { items: [] } }
        : type === "calendar"
        ? { id: crypto.randomUUID(), type: "calendar", data: { events: {} } }
        : { id: crypto.randomUUID(), type: "table", data: { cols: 2, rows: 2, colWidths: [150, 150], grid: [["Header 1", "Header 2"], ["", ""]] } };

    const updated = [...blocks];
    updated.splice(index, 0, newBlock);
    onChange(updated);
    setShowAdd(null);
  }

  function removeBlock(id: string) {
    onChange(blocks.filter((b) => b.id !== id));
  }

  function updateBlock(updatedBlock: Block) {
    onChange(blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b)));
  }

  function AddMenu({ index }: { index: number }) {
    if (showAdd !== index) {
      return (
        <div className="flex justify-center my-4">
          <button
            onClick={() => setShowAdd(index)}
            className="neu-button w-8 h-8 rounded-full flex items-center justify-center text-amber-900 font-bold"
            title="Add block"
          >
            +
          </button>
        </div>
      );
    }
    return (
      <div className="flex justify-center my-4">
        <div className="neu-inset p-2 rounded-2xl flex gap-2">
          <button onClick={() => addBlock("todo", index)} className="neu-button px-3 py-1.5 text-xs font-medium text-ink">To-do List</button>
          <button onClick={() => addBlock("calendar", index)} className="neu-button px-3 py-1.5 text-xs font-medium text-ink">Calendar</button>
          <button onClick={() => addBlock("table", index)} className="neu-button px-3 py-1.5 text-xs font-medium text-ink">Table</button>
          <button onClick={() => setShowAdd(null)} className="neu-button px-3 py-1.5 text-xs font-medium text-muted hover:text-red-600">Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {blocks.length === 0 && (
        <div className="neu-panel p-8 text-center border border-dashed border-muted/30">
          <p className="text-muted text-sm mb-4">No blocks yet. Add one to get started.</p>
          <AddMenu index={0} />
        </div>
      )}

      {blocks.map((block, i) => (
        <div key={block.id}>
          <AddMenu index={i} />
          <div className="neu-panel p-6 relative group">
            <button
              onClick={() => removeBlock(block.id)}
              className="absolute top-4 right-4 text-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold z-10"
              title="Remove block"
            >
              ×
            </button>
            <div className="mb-4">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider bg-surface shadow-neu-inset px-2 py-1 rounded-md">
                {block.type}
              </span>
            </div>
            {block.type === "todo" && <TodoBlock block={block} onChange={updateBlock} />}
            {block.type === "calendar" && <CalendarBlock block={block} onChange={updateBlock} />}
            {block.type === "table" && <TableBlock block={block} onChange={updateBlock} />}
          </div>
        </div>
      ))}

      {blocks.length > 0 && <AddMenu index={blocks.length} />}
    </div>
  );
}
