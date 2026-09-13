import {
  parseISO,
  isSameDay,
  isTomorrow,
  isYesterday,
  isPast,
  isFuture,
  differenceInDays,
} from "date-fns";

// Current date helper with timeout-safe fallback
function getSafeNowDate(): Date {
  if (typeof window !== "undefined" && window.Date) {
    const now = new window.Date();
    if (!isNaN(now.getTime())) return now;
  }
  return new Date();
}

type UrgencyLabel = "Overdue" | "Due Today" | "Due Tomorrow" | "Due Soon" | "Future";

export type { UrgencyLabel };

export function calculateUrgency(dueDate: string, status: string): UrgencyLabel {
  const trimmed = dueDate?.trim();
  if (!trimmed) {
    return "Future";
  }

  const dueAtUTC = parseISO(trimmed);
  const now = getSafeNowDate();

  if (status === "Completed") {
    return "Future";
  }

  if (isSameDay(dueAtUTC, now)) {
    return "Due Today";
  }

  if (isTomorrow(dueAtUTC)) {
    return "Due Tomorrow";
  }

  if (isYesterday(dueAtUTC) || isPast(dueAtUTC)) {
    return "Overdue";
  }

  if (isFuture(dueAtUTC)) {
    const diffInDays = differenceInDays(dueAtUTC, now);
    if (diffInDays <= 3 && diffInDays > 0) {
      return "Due Soon";
    }
  }

  return "Future";
}

export function getDaysRemaining(dueDate: string): number {
  const dueAtUTC = parseISO(dueDate?.trim());
  const now = getSafeNowDate();
  const diffInDays = differenceInDays(dueAtUTC, now);
  return diffInDays;
}

// Dashboard helpers
export function calculateTaskStats(tasks: { status?: string; due_date?: string }[]): {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  dueToday: number;
  overdue: number;
} {
  let total = 0;
  let pending = 0;
  let inProgress = 0;
  let completed = 0;
  let dueToday = 0;
  let overdue = 0;

  tasks.forEach((task) => {
    const status = (task.status ?? "").trim();
    if (status === "Completed") {
      completed++;
    } else if (status === "In Progress") {
      inProgress++;
    } else {
      pending++;
    }
    total++;

    if (status !== "Completed") {
      const days = getDaysRemaining(task.due_date ?? "");
      if (days === 0) dueToday++;
      if (days < 0) overdue++;
    }
  });

  return { total, pending, inProgress, completed, dueToday, overdue };
}

export function getSubjectProgress(
  tasks: { subject?: string; status?: string }[]
): Record<string, { completed: number; total: number }> {
  const map: Record<string, { completed: number; total: number }> = {};

  tasks.forEach((task) => {
    const subject = (task.subject ?? "Unassigned").trim() || "Unassigned";
    const status = (task.status ?? "").trim();
    const entry = map[subject] ?? { completed: 0, total: 0 };
    entry.total++;
    if (status === "Completed") entry.completed++;
    map[subject] = entry;
  });

  return map;
}

export function getUpcomingTasks(
  tasks: { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[],
  limit: number
): { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[] {
  return tasks
    .filter((task) => (task.status ?? "").trim() !== "Completed")
    .sort((a, b) => {
      const aDate = parseISO((a.due_date ?? "").trim());
      const bDate = parseISO((b.due_date ?? "").trim());
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, limit);
}

export function getDueTodayTasks(
  tasks: { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[]
): { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[] {
  return tasks.filter((task) => {
    if ((task.status ?? "").trim() === "Completed") return false;
    const days = getDaysRemaining((task.due_date ?? "").trim());
    return days === 0;
  });
}

export function getOverdueTasks(
  tasks: { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[],
  limit: number
): { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[] {
  return tasks
    .filter((task) => {
      if ((task.status ?? "").trim() === "Completed") return false;
      const days = getDaysRemaining((task.due_date ?? "").trim());
      return days < 0;
    })
    .sort((a, b) => {
      const aDate = parseISO((a.due_date ?? "").trim());
      const bDate = parseISO((b.due_date ?? "").trim());
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, limit);
}

export function getUpcomingTests(
  tasks: { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[],
  limit: number
): { id?: string; title?: string; subject?: string; type?: string; due_date?: string; status?: string }[] {
  return tasks
    .filter((task) => {
      if ((task.status ?? "").trim() === "Completed") return false;
      return (task.type ?? "").trim() === "Class Test";
    })
    .sort((a, b) => {
      const aDate = parseISO((a.due_date ?? "").trim());
      const bDate = parseISO((b.due_date ?? "").trim());
      return aDate.getTime() - bDate.getTime();
    })
    .slice(0, limit);
}

// Get urgency label for display
export function getUrgencyLabel(urgency: UrgencyLabel): string {
  return urgency;
}

// Priority badge classes
export function getPriorityClasses(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700 border-red-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Low":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// Type badge classes
export function getTypeClasses(type: string): string {
  switch (type) {
    case "Assignment":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Class Test":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

// Urgency badge classes
function buildUrgencyBadgeClassesInner(urgency: UrgencyLabel): Record<string, boolean> {
  switch (urgency) {
    case "Overdue":
      return { "bg-red-500": true, "bg-opacity-10": true, "text-red-600": true };
    case "Due Today":
      return { "bg-red-500": true, "bg-opacity-10": true, "text-red-600": true };
    case "Due Tomorrow":
      return { "bg-orange-500": true, "bg-opacity-10": true, "text-orange-600": true };
    case "Due Soon":
      return { "bg-yellow-500": true, "bg-opacity-10": true, "text-yellow-600": true };
    case "Future":
    default:
      return { "bg-blue-500": true, "bg-opacity-10": true, "text-blue-600": true };
  }
}

function classesFromConfig(config: Record<string, boolean>): string {
  return Object.entries(config)
    .filter(([, value]) => value)
    .map(([cls]) => cls)
    .join(" ");
}

export function getUrgencyBadgeClasses(urgency: UrgencyLabel): string {
  return classesFromConfig(buildUrgencyBadgeClassesInner(urgency));
}

// Calendar helpers
export function isSameUTCDay(a: Date, b: Date): boolean {
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  );
}

// Status helpers
export function nextStatus(current: string): string {
  if (current === "Not Started") return "In Progress";
  if (current === "In Progress") return "Completed";
  return "Not Started";
}

export function nextPriority(current: string): string {
  if (current === "Low") return "Medium";
  if (current === "Medium") return "High";
  return "Low";
}
