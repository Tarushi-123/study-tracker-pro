import {
  isToday,
  isTomorrow,
  isPast,
  differenceInDays,
  parseISO,
  startOfDay,
} from "date-fns";
import type { Task, UrgencyLevel, TaskStats } from "@/types";

export function calculateUrgency(dueDate: string, status: string): UrgencyLevel {
  if (status === "completed") return "completed";

  const due = parseISO(dueDate);
  const now = startOfDay(new Date());

  if (isToday(due)) return "due_today";
  if (isTomorrow(due)) return "due_tomorrow";

  const daysUntilDue = differenceInDays(due, now);

  if (daysUntilDue < 0) return "overdue";
  if (daysUntilDue <= 3) return "due_soon";

  return "normal";
}

export function getDaysRemaining(dueDate: string): number {
  const due = parseISO(dueDate);
  const now = startOfDay(new Date());
  return differenceInDays(due, now);
}

export function getUrgencyBadgeClasses(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "completed":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "due_today":
      return "bg-red-100 text-red-700 border-red-200";
    case "due_tomorrow":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "due_soon":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "overdue":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-blue-100 text-blue-700 border-blue-200";
  }
}

export function getUrgencyLabel(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "completed":
      return "🟢 Completed";
    case "due_today":
      return "🔴 Due Today";
    case "due_tomorrow":
      return "🟠 Due Tomorrow";
    case "due_soon":
      return "🟡 Due Soon";
    case "overdue":
      return "⚫ Overdue";
    default:
      return "Upcoming";
  }
}

export function getPriorityClasses(priority: string): string {
  switch (priority) {
    case "high":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "low":
      return "bg-sky-100 text-sky-700 border-sky-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function getTypeClasses(type: string): string {
  switch (type) {
    case "assignment":
      return "bg-violet-100 text-violet-700 border-violet-200";
    case "class_test":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function calculateTaskStats(tasks: Task[]): TaskStats {
  const today = startOfDay(new Date());

  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status !== "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    dueToday: tasks.filter((t) => {
      const due = parseISO(t.due_date);
      return isToday(due) && t.status !== "completed";
    }).length,
    overdue: tasks.filter((t) => {
      const due = parseISO(t.due_date);
      return isPast(due) && !isToday(due) && t.status !== "completed";
    }).length,
    upcomingTests: tasks.filter((t) => {
      const due = parseISO(t.due_date);
      return t.type === "class_test" && due >= today && t.status !== "completed";
    }).length,
  };
}

export function getSubjectProgress(tasks: Task[]): Record<string, { total: number; completed: number }> {
  const progress: Record<string, { total: number; completed: number }> = {};

  tasks.forEach((task) => {
    if (!progress[task.subject]) {
      progress[task.subject] = { total: 0, completed: 0 };
    }
    progress[task.subject].total++;
    if (task.status === "completed") {
      progress[task.subject].completed++;
    }
  });

  return progress;
}

export function getUpcomingTasks(tasks: Task[], limit: number = 5): Task[] {
  const now = startOfDay(new Date());
  return tasks
    .filter((t) => t.status !== "completed" && parseISO(t.due_date) >= now)
    .sort((a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime())
    .slice(0, limit);
}

export function getOverdueTasks(tasks: Task[], limit: number = 5): Task[] {
  return tasks
    .filter((t) => t.status !== "completed" && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)))
    .sort((a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime())
    .slice(0, limit);
}

export function getDueTodayTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.status !== "completed" && isToday(parseISO(t.due_date)));
}

export function getUpcomingTests(tasks: Task[], limit: number = 5): Task[] {
  const now = startOfDay(new Date());
  return tasks
    .filter((t) => t.type === "class_test" && t.status !== "completed" && parseISO(t.due_date) >= now)
    .sort((a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime())
    .slice(0, limit);
}

export function getRecentTasks(tasks: Task[], limit: number = 5): Task[] {
  return [...tasks]
    .sort((a, b) => parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime())
    .slice(0, limit);
}
