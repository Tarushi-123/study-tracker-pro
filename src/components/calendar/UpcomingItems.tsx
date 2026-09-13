import { format, parseISO, addDays } from "date-fns";
import { Calendar, FlaskConical, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";
import type { Event } from "@/types/events";
import { calculateUrgency, getDaysRemaining, getUrgencyBadgeClasses } from "@/lib/task-utils";
import { getEventTypeColor } from "@/lib/calendar-utils";

interface UpcomingItem {
  id: string;
  kind: "task" | "event";
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
  dateLabel: string;
  sortDate: Date;
}

interface UpcomingItemsProps {
  tasks: Task[];
  events: Event[];
  onItemClick: (item: UpcomingItem) => void;
}

export function UpcomingItems({ tasks, events, onItemClick }: UpcomingItemsProps) {
  const now = new Date();
  const items = buildUpcomingItems(tasks, events, now);

  if (items.length === 0) {
    return (
      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4 text-center">
        <p className="text-sm text-[#8b7355]">No upcoming tasks or events.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4">
      <h3 className="text-base font-semibold text-[#3d3429] flex items-center gap-2 mb-3">
        <Zap className="h-4 w-4 text-[#8b7355]" />
        Upcoming
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 p-2 rounded-xl hover:bg-[#f0e6d8] cursor-pointer transition-colors"
            onClick={() => onItemClick(item)}
          >
            <Badge variant="outline" className="shrink-0 mt-0.5">
              {item.icon}
            </Badge>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#3d3429] truncate">
                {item.title}
              </p>
              <p className="text-xs text-[#8b7355]">
                {item.subtitle}
              </p>
            </div>
            <Badge variant="outline" className={`shrink-0 text-[10px] font-medium ${item.colorClass}`}>
              {item.dateLabel}
            </Badge>
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildUpcomingItems(tasks: Task[], events: Event[], now: Date): UpcomingItem[] {
  const items: UpcomingItem[] = [];

  tasks.forEach((task) => {
    const due = parseISO(task.due_date);
    const daysRemaining = getDaysRemaining(task.due_date);
    const isCompleted = task.status === "Completed";
    const isPast = due < now && !isCompleted;

    if (isCompleted) return;

    let dateLabel: string;
    if (isPast) {
      dateLabel = `${Math.abs(daysRemaining)}d overdue`;
    } else if (daysRemaining === 0) {
      dateLabel = "Today";
    } else if (daysRemaining === 1) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = format(due, "MMM d");
    }

    items.push({
      id: task.id,
      kind: "task",
      title: task.title,
      subtitle: `${task.subject} — ${task.type === "Assignment" ? "Assignment" : "Class Test"}`,
      icon: task.type === "Assignment" ? (
        <Calendar className="h-3.5 w-3.5" />
      ) : (
        <FlaskConical className="h-3.5 w-3.5" />
      ),
      colorClass: getUrgencyBadgeClasses(calculateUrgency(task.due_date, task.status)),
      dateLabel,
      sortDate: isPast ? addMs(due, 1) : due,
    });
  });

  events.forEach((event) => {
    const date = parseISO(event.event_date);
    const isPast = date < now;

    let dateLabel: string;
    if (date < now) {
      const daysDiff = Math.round((now.getTime() - date.getTime()) / 86400000);
      dateLabel = `${daysDiff}d ago`;
    } else if (format(date, "yyyy-MM-dd") === format(now, "yyyy-MM-dd")) {
      dateLabel = "Today";
    } else if (format(date, "yyyy-MM-dd") === format(addDays(now, 1), "yyyy-MM-dd")) {
      dateLabel = "Tomorrow";
    } else {
      dateLabel = format(date, "MMM d");
    }

    items.push({
      id: event.id,
      kind: "event",
      title: event.title,
      subtitle: event.event_type,
      icon: <FlaskConical className="h-3.5 w-3.5" />,
      colorClass: getEventTypeColor(event.event_type),
      dateLabel,
      sortDate: isPast ? addMs(date, 1) : date,
    });
  });

  items.sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
  return items.slice(0, 5);
}

function addMs(date: Date, ms: number): Date {
  return new Date(date.getTime() + ms);
}
