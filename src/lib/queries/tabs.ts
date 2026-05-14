import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Block } from "@/components/blocks/types";

const supabase = createClient();

// ── Generic helpers ───────────────────────────────────────

type TabTable = "pm_initiation" | "pm_planning" | "pm_execution" | "pm_closing";

async function fetchTab<T>(table: TabTable, projectId: string): Promise<T | null> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function upsertTab<T extends Record<string, unknown>>(
  table: TabTable,
  projectId: string,
  payload: Partial<T>
): Promise<void> {
  const { error } = await supabase.from(table).upsert(
    { ...payload, project_id: projectId },
    { onConflict: "project_id" }
  );
  if (error) throw error;
}

// ── Initiation ────────────────────────────────────────────

export type Initiation = {
  id: string;
  project_id: string;
  blocks: Block[] | null;
};

export function useInitiation(projectId: string) {
  return useQuery({
    queryKey: ["initiation", projectId],
    queryFn: () => fetchTab<Initiation>("pm_initiation", projectId),
  });
}

export function useSaveInitiation(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Initiation>) =>
      upsertTab("pm_initiation", projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["initiation", projectId] }),
  });
}

// ── Planning ──────────────────────────────────────────────

export type Planning = {
  id: string;
  project_id: string;
  blocks: Block[] | null;
};

export function usePlanning(projectId: string) {
  return useQuery({
    queryKey: ["planning", projectId],
    queryFn: () => fetchTab<Planning>("pm_planning", projectId),
  });
}

export function useSavePlanning(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Planning>) =>
      upsertTab("pm_planning", projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["planning", projectId] }),
  });
}

// ── Execution ─────────────────────────────────────────────

export type Execution = {
  id: string;
  project_id: string;
  completion_percentage?: number | null;
  blocks: Block[] | null;
};

export function useExecution(projectId: string) {
  return useQuery({
    queryKey: ["execution", projectId],
    queryFn: () => fetchTab<Execution>("pm_execution", projectId),
  });
}

export function useSaveExecution(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Execution>) =>
      upsertTab("pm_execution", projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["execution", projectId] }),
  });
}

// ── Closing ───────────────────────────────────────────────

export type Closing = {
  id: string;
  project_id: string;
  closed_at?: string | null;
  blocks: Block[] | null;
};

export function useClosing(projectId: string) {
  return useQuery({
    queryKey: ["closing", projectId],
    queryFn: () => fetchTab<Closing>("pm_closing", projectId),
  });
}

export function useSaveClosing(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Closing>) =>
      upsertTab("pm_closing", projectId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["closing", projectId] }),
  });
}
