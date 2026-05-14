"use client";

import { useState } from "react";
import type { TodoBlockData, TodoItem } from "./types";

type Props = {
  block: TodoBlockData;
  onChange: (block: TodoBlockData) => void;
};

export default function TodoBlock({ block, onChange }: Props) {
  const [newItem, setNewItem] = useState("");

  const items = block.data.items || [];

  function addItem() {
    if (!newItem.trim()) return;
    onChange({
      ...block,
      data: {
        ...block.data,
        items: [
          ...items,
          { id: crypto.randomUUID(), text: newItem.trim(), completed: false },
        ],
      },
    });
    setNewItem("");
  }

  function toggleItem(id: string) {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: items.map((i) =>
          i.id === id ? { ...i, completed: !i.completed } : i
        ),
      },
    });
  }

  function removeItem(id: string) {
    onChange({
      ...block,
      data: {
        ...block.data,
        items: items.filter((i) => i.id !== id),
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleItem(item.id)}
              className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
            />
            <span className={`flex-1 text-sm ${item.completed ? 'line-through text-muted' : 'text-ink'}`}>
              {item.text}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted hover:text-red-600 text-sm font-medium transition-colors"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
          placeholder="Add a to-do..."
          className="flex-1 neu-input px-3 py-2 text-sm"
        />
        <button
          onClick={addItem}
          disabled={!newItem.trim()}
          className="neu-button px-4 py-2 text-sm font-semibold text-amber-900"
        >
          Add
        </button>
      </div>
    </div>
  );
}
