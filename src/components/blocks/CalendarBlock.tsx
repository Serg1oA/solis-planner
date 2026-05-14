"use client";

import { useState } from "react";
import type { CalendarBlockData } from "./types";

type Props = {
  block: CalendarBlockData;
  onChange: (block: CalendarBlockData) => void;
};

export default function CalendarBlock({ block, onChange }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState("");

  const events = block.data.events || {};

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  function addEvent() {
    if (!newEvent.trim() || !selectedDateStr) return;
    const dayEvents = events[selectedDateStr] || [];
    onChange({
      ...block,
      data: {
        ...block.data,
        events: {
          ...events,
          [selectedDateStr]: [...dayEvents, newEvent.trim()],
        },
      },
    });
    setNewEvent("");
    setSelectedDateStr(null);
  }

  function removeEvent(dateStr: string, index: number) {
    const dayEvents = [...(events[dateStr] || [])];
    dayEvents.splice(index, 1);
    onChange({
      ...block,
      data: {
        ...block.data,
        events: {
          ...events,
          [dateStr]: dayEvents,
        },
      },
    });
  }

  // Generate grid cells
  const blanks = Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`blank-${i}`} className="p-2 bg-surface/50 rounded-xl" />);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const day = i + 1;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const dayEvents = events[dateStr] || [];
    const isSelected = selectedDateStr === dateStr;
    const isToday = new Date().toISOString().split("T")[0] === dateStr;

    return (
      <div
        key={day}
        className={`p-2 min-h-[80px] rounded-xl flex flex-col gap-1 cursor-pointer transition-shadow ${
          isSelected ? "neu-inset border border-amber-400/50" : "neu-card hover:shadow-neu"
        }`}
        onClick={() => setSelectedDateStr(isSelected ? null : dateStr)}
      >
        <span className={`text-xs font-semibold ${isToday ? 'text-amber-700 bg-amber-100/50 px-1 rounded' : 'text-ink'}`}>
          {day}
        </span>
        <div className="flex flex-col gap-1 overflow-y-auto max-h-[60px] no-scrollbar">
          {dayEvents.map((evt, idx) => (
            <div key={idx} className="text-[10px] leading-tight bg-amber-400/20 text-amber-900 px-1 py-0.5 rounded flex justify-between group/evt">
              <span className="truncate">{evt}</span>
              <button
                onClick={(e) => { e.stopPropagation(); removeEvent(dateStr, idx); }}
                className="opacity-0 group-hover/evt:opacity-100 hover:text-red-700 ml-1 font-bold"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-2">
        <button onClick={prevMonth} className="neu-button px-3 py-1 text-sm font-bold text-amber-900">&lt;</button>
        <h3 className="text-lg font-bold text-ink">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h3>
        <button onClick={nextMonth} className="neu-button px-3 py-1 text-sm font-bold text-amber-900">&gt;</button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs font-bold text-muted uppercase tracking-wider mb-2">
            {d}
          </div>
        ))}
        {blanks}
        {days}
      </div>

      {selectedDateStr && (
        <div className="flex gap-2 mt-2 pt-4 border-t border-muted/20">
          <span className="flex items-center text-xs font-bold text-amber-800 bg-surface shadow-neu-inset px-3 rounded-xl">
            {selectedDateStr}
          </span>
          <input
            autoFocus
            value={newEvent}
            onChange={(e) => setNewEvent(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addEvent(); } }}
            placeholder="New event..."
            className="flex-1 neu-input px-3 py-2 text-sm"
          />
          <button
            onClick={addEvent}
            disabled={!newEvent.trim()}
            className="neu-button px-4 py-2 text-sm font-semibold text-amber-900"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
