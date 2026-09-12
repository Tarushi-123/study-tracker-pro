import { parseISO } from "date-fns";
import type { Task, UrgencyLevel, TaskStats } from "@/types";

/**
 * Timezone-safe date comparison utilities.
 *
 * All date-only comparisons (today/tomorrow/overdue/etc.) are normalized to
 * UTC midnight to avoid off-by-one errors caused by mixing local timezone
 * offsets with UTC-stored dates.
 *
 * When Supabase stores a date-only string like "2024-09-15", it becomes a
 * TIMESTAMPTZ at midnight UTC. These helpers extract the UTC calendar date
 * from both the stored timestamp and the current moment, then compare only
 * the date parts — so a user in UTC-5 and a user in UTC+8 see the same
 * "due today" / "overdue" / "due tomorrow" for the same task.
 */

/** Get the UTC calendar date components of a Date or ISO string. */
function getUTCDateParts(input: Date | string): {
  year: number;
  month: number;
  day: number;
} {
  const d = typeof input === "string" ? parseISO(input) : input;
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
  };
}

/** Check if two dates represent the same UTC calendar day. */
function isSameUTCDay(a: Date | string, b: Date | string): boolean {
  const pa = getUTCDateParts(a);
  const pb = getUTCDateParts(b);
  return pa.year === pb.year && pa.month === pb.month && pa.day === pb.day;
}

/** Return the number of UTC calendar days between two dates. Positive = a is after b. */
function diffUTCDays(a: Date | string, b: Date | string): number {
  const pa = getUTCDateParts(a);
  const pb = getUTCDateParts(b);
  // Normalize both to epoch days
  const dayA = Date.UTC(pa.year, pa.month, pa.day) / 86400000;
  const dayB = Date.UTC(pb.year, pb.month, pb.day) / 86400000;
  return dayA - dayB;
}

/** Check if a's UTC calendar date is strictly before b's UTC calendar date. */
function isBeforeUTCDay(a: Date | string, b: Date | string): boolean {
  return diffUTCDays(a, b) < 0;
}

/** Get today's date as a UTC-normalized Date (midnight UTC today). */
function todayUTC(): Date {
  const now = new Date();
  return new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  ));
}

export function calculateUrgency(dueDate: string, status: string): UrgencyLevel {
  if (status === "completed") return "completed";

  const now = todayUTC();
  const due = parseISO(dueDate);

  if (isSameUTCDay(due, now)) return "due_today";

  const days = diffUTCDays(due, now);

  if (days === 1) return "due_tomorrow";
  if (days < 0) return "overdue";
  if (days <= 3) return "due_soon";

  return "normal";
}

export function getDaysRemaining(dueDate: string): number {
  const now = todayUTC();
  return diffUTCDays(parseISO(dueDate), now);
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
  const now = todayUTC();

  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status !== "completed").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    dueToday: tasks.filter((t) => {
      return isSameUTCDay(t.due_date, now) && t.status !== "completed";
    }).length,
    overdue: tasks.filter((t) => {
      return isBeforeUTCDay(t.due_date, now) && t.status !== "completed";
    }).length,
    upcomingTests: tasks.filter((t) => {
      return (
        t.type === "class_test" &&
        t.status !== "completed" &&
        !isBeforeUTCDay(t.due_date, now)
      );
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
  const now = todayUTC();
  return tasks
    .filter(
      (t) => t.status !== "completed" && !isBeforeUTCDay(t.due_date, now),
    )
    .sort(
      (a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime(),
    )
    .slice(0, limit);
}

export function getOverdueTasks(tasks: Task[], limit: number = 5): Task[] {
  const now = todayUTC();
  return tasks
    .filter(
      (t) => t.status !== "completed" && isBeforeUTCDay(t.due_date, now),
    )
    .sort(
      (a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime(),
    )
    .slice(0, limit);
}

export function getDueTodayTasks(tasks: Task[]): Task[] {
  const now = todayUTC();
  return tasks.filter(
    (t) => t.status !== "completed" && isSameUTCDay(t.due_date, now),
  );
}

export function getUpcomingTests(tasks: Task[], limit: number = 5): Task[] {
  const now = todayUTC();
  return tasks
    .filter(
      (t) =>
        t.type === "class_test" &&
        t.status !== "completed" &&
        !isBeforeUTCDay(t.due_date, now),
    )
    .sort(
      (a, b) => parseISO(a.due_date).getTime() - parseISO(b.due_date).getTime(),
    )
    .slice(0, limit);
}

export function getRecentTasks(tasks: Task[], limit: number = 5): Task[] {
  return [...tasks]
    .sort(
      (a, b) =>
        parseISO(b.created_at).getTime() - parseISO(a.created_at).getTime(),
    )
    .slice(0, limit);
}
