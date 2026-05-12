import { createClient } from "@/lib/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type Project = {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
};

const supabase = createClient();

// ── Fetchers ──────────────────────────────────────────────

async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("pm_projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

async function createProject(payload: {
  name: string;
  description: string;
}): Promise<Project> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("pm_projects")
    .insert({ ...payload, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function deleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("pm_projects").delete().eq("id", id);
  if (error) throw error;
}

// ── Hooks ─────────────────────────────────────────────────

export function useProjects() {
  return useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}

async function updateProject(id: string, payload: Partial<Pick<Project, "name" | "description" | "status">>): Promise<Project> {
  const { data, error } = await supabase
    .from("pm_projects")
    .update(payload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export function useUpdateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & Partial<Pick<Project, "name" | "description" | "status">>) =>
      updateProject(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });
}