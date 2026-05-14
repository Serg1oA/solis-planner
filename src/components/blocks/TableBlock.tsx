"use client";

import { useState, useRef, useEffect } from "react";
import type { TableBlockData } from "./types";

type Props = {
  block: TableBlockData;
  onChange: (block: TableBlockData) => void;
};

export default function TableBlock({ block, onChange }: Props) {
  const { cols, rows, grid, colWidths } = block.data;

  // Resizing state
  const [resizingCol, setResizingCol] = useState<number | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (resizingCol === null) return;
      const diff = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + diff); // Min width 50px

      const newWidths = [...colWidths];
      newWidths[resizingCol] = newWidth;
      onChange({ ...block, data: { ...block.data, colWidths: newWidths } });
    }

    function handleMouseUp() {
      setResizingCol(null);
    }

    if (resizingCol !== null) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingCol, startX, startWidth, colWidths, block, onChange]);

  function startResize(e: React.MouseEvent, colIndex: number) {
    e.preventDefault();
    setResizingCol(colIndex);
    setStartX(e.clientX);
    setStartWidth(colWidths[colIndex] || 150);
  }

  function updateCell(rIndex: number, cIndex: number, val: string) {
    const newGrid = grid.map((row, r) =>
      r === rIndex ? row.map((cell, c) => (c === cIndex ? val : cell)) : row
    );
    onChange({ ...block, data: { ...block.data, grid: newGrid } });
  }

  function addRow() {
    onChange({
      ...block,
      data: {
        ...block.data,
        rows: rows + 1,
        grid: [...grid, Array(cols).fill("")],
      },
    });
  }

  function removeRow() {
    if (rows <= 1) return;
    onChange({
      ...block,
      data: {
        ...block.data,
        rows: rows - 1,
        grid: grid.slice(0, rows - 1),
      },
    });
  }

  function addCol() {
    onChange({
      ...block,
      data: {
        ...block.data,
        cols: cols + 1,
        colWidths: [...colWidths, 150],
        grid: grid.map((row) => [...row, ""]),
      },
    });
  }

  function removeCol() {
    if (cols <= 1) return;
    onChange({
      ...block,
      data: {
        ...block.data,
        cols: cols - 1,
        colWidths: colWidths.slice(0, cols - 1),
        grid: grid.map((row) => row.slice(0, cols - 1)),
      },
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm text-muted">
        <button onClick={addCol} className="neu-button px-2 py-1 text-xs text-amber-900">+ Col</button>
        <button onClick={removeCol} disabled={cols <= 1} className="neu-button px-2 py-1 text-xs">- Col</button>
        <div className="w-px h-4 bg-muted/30 mx-1" />
        <button onClick={addRow} className="neu-button px-2 py-1 text-xs text-amber-900">+ Row</button>
        <button onClick={removeRow} disabled={rows <= 1} className="neu-button px-2 py-1 text-xs">- Row</button>
      </div>

      <div className="overflow-x-auto pb-4 no-scrollbar cursor-col-resize" style={{ cursor: resizingCol !== null ? 'col-resize' : 'auto' }}>
        <div ref={containerRef} className="min-w-max inline-block bg-surface shadow-neu-inset rounded-xl p-2 border border-muted/10 select-none">
          <div className="flex flex-col">
            {grid.map((row, rIndex) => (
              <div key={rIndex} className="flex">
                {row.map((cell, cIndex) => (
                  <div
                    key={`${rIndex}-${cIndex}`}
                    className="relative flex items-center border-r border-b border-transparent group/cell"
                    style={{ width: colWidths[cIndex] || 150 }}
                  >
                    <input
                      value={cell}
                      onChange={(e) => updateCell(rIndex, cIndex, e.target.value)}
                      className={`w-full px-3 py-2 text-sm bg-transparent border-b border-transparent focus:border-amber-400/50 outline-none text-ink ${
                        rIndex === 0 ? "font-bold border-b-muted/30" : ""
                      }`}
                      placeholder={rIndex === 0 ? "Header" : "Value"}
                    />
                    {/* Resize Handle */}
                    {rIndex === 0 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-col-resize hover:bg-amber-400/30 z-10"
                        onMouseDown={(e) => startResize(e, cIndex)}
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
