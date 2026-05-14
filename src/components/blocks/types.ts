export type BlockType = "todo" | "calendar" | "table";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodoBlockData extends BaseBlock {
  type: "todo";
  data: {
    items: TodoItem[];
  };
}

export interface CalendarBlockData extends BaseBlock {
  type: "calendar";
  data: {
    events: Record<string, string[]>; // date string "YYYY-MM-DD" -> array of events
  };
}

export interface TableBlockData extends BaseBlock {
  type: "table";
  data: {
    cols: number;
    rows: number;
    colWidths: number[]; // Array of widths in pixels
    grid: string[][];
  };
}

export type Block = TodoBlockData | CalendarBlockData | TableBlockData;
