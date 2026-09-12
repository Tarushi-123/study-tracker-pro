export type TaskType = "assignment" | "class_test";
export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "not_started" | "in_progress" | "completed";

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  subject: string;
  type: TaskType;
  due_date: string;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  dueToday: number;
  overdue: number;
  upcomingTests: number;
}

export type UrgencyLevel =
  | "completed"
  | "due_today"
  | "due_tomorrow"
  | "due_soon"
  | "overdue"
  | "normal";
