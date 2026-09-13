import { format, parseISO } from "date-fns";
import { Calendar, FlaskConical, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types";
import type { Event } from "@/types/events";
import {
  calculateUrgency,
  getDaysRemaining,
  getUrgencyBadgeClasses,
  getPriorityClasses,
  getTypeClasses,
} from "@/lib/task-utils";
import { getEventTypeColor } from "@/lib/calendar-utils";



type CalendarItem = Task | Event;

interface CalendarItemProps {
  item: CalendarItem;
  onClick: () => void;
}

const EVENT_TYPE_ICONS: Record<string, React.ReactNode> = {
  Hackathon: <FlaskConical className="h-3 w-3" />,
  Workshop: <FlaskConical className="h-3 w-3" />,
  Seminar: <FlaskConical className="h-3 w-3" />,
  Competition: <FlaskConical className="h-3 w-3" />,
  "Club Event": <FlaskConical className="h-3 w-3" />,
  "College Event": <FlaskConical className="h-3 w-3" />,
  "Exam Deadline": <Calendar className="h-3 w-3" />,
  "Registration Deadline": <Calendar className="h-3 w-3" />,
  "Scholarship Deadline": <Calendar className="h-3 w-3" />,
  "Project Deadline": <Calendar className="h-3 w-3" />,
  "Internship Deadline": <Calendar className="h-3 w-3" />,
  Other: <Calendar className="h-3 w-3" />,
};

export function CalendarItem({ item, onClick }: CalendarItemProps) {
  if (isTask(item)) {
    return <CalendarTaskItem task={item} onClick={onClick} />;
  }
  return <CalendarEventItem event={item} onClick={onClick} />;
}

function isTask(item: CalendarItem): item is Task {
  return "type" in item && "priority" in item;
}

function isEvent(item: CalendarItem): item is Event {
  return "event_type" in item;
}

function CalendarTaskItem({ task, onClick }: { task: Task; onClick: () => void }) {
  const urgency = calculateUrgency(task.due_date, task.status);
  const daysRemaining = getDaysRemaining(task.due_date);
  const isOverdue = daysRemaining < 0;
  const isDueToday = daysRemaining === 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg p-1 border-0 bg-transparent shadow-none hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-inset"
    >
      <div
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm border ${getTypeClasses(task.type)}`}
      >
        {task.type === "Assignment" ? (
          <Calendar className="h-3 w-3" />
        ) : (
          <FlaskConical className="h-3 w-3" />
        )}
        {task.type === "Assignment" ? "Assignment" : "Class Test"}
      </div>
      <p className="text-xs font-semibold text-[#3d3429] mt-1 leading-tight truncate pr-2">
        {task.title}
      </p>
      <div className="flex items-center gap-1.5 flex-wrap">
        <Badge
          variant="outline"
          className={`text-[9px] font-medium ${getPriorityClasses(task.priority)}`}
        >
          <Tag className="h-2.5 w-2.5 mr-0.5" />
          {task.priority}
        </Badge>
        {task.status !== "Completed" && (
          <Badge
            variant="outline"
            className={`text-[9px] font-medium ${getUrgencyBadgeClasses(urgency)}`}
          >
            <Clock className="h-2.5 w-2.5 mr-0.5" />
            {isOverdue
              ? "Overdue"
              : isDueToday
                ? "Today"
                : daysRemaining === 1
                  ? "Tomorrow"
                  : `${daysRemaining}d`}
          </Badge>
        )}
      </div>
    </button>
  );
}

function CalendarEventItem({ event, onClick }: { event: Event; onClick: () => void }) {
  const dateDisplay = format(parseISO(event.event_date), "MMM d");

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg p-1 border-0 bg-transparent shadow-none hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-inset"
    >
      <div
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm border ${getEventTypeColor(event.event_type)}`}
      >
        {EVENT_TYPE_ICONS[event.event_type] ?? <Calendar className="h-3 w-3" />}
        {event.event_type}
      </div>
      <p className="text-xs font-semibold text-[#3d3429] mt-1 leading-tight truncate pr-2">
        {event.title}
      </p>
      <div className="flex items-center gap-1 text-[9px] text-[#8b7355]">
        {format(parseISO(event.event_date), "EEE")}
        {" "}
        {dateDisplay}
      </div>
    </button>
  );
}
