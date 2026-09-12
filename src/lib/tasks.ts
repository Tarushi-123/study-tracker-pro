import { supabase, isSupabaseConfigured } from "./supabase";
import type { Task, TaskType, TaskPriority, TaskStatus } from "@/types";

export async function getTasks(): Promise<{ data: Task[] | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: [], error: null };
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("due_date", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function createTask(task: {
  title: string;
  description: string;
  subject: string;
  type: TaskType;
  due_date: string;
  priority: TaskPriority;
}): Promise<{ data: Task | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase is not configured." };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Not authenticated" };
  }

  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: task.title,
      description: task.description,
      subject: task.subject,
      type: task.type,
      due_date: task.due_date,
      priority: task.priority,
      status: "Not Started" as TaskStatus,
    })
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function updateTask(
  taskId: string,
  updates: Partial<{
    title: string;
    description: string;
    subject: string;
    type: TaskType;
    due_date: string;
    priority: TaskPriority;
    status: TaskStatus;
  }>,
): Promise<{ data: Task | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase is not configured." };
  const { data, error } = await supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteTask(taskId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase is not configured." };
  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
