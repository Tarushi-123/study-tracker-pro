import { Calendar, FlaskConical, Tag, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Task, TaskPriority, TaskStatus, TaskType } from "@/types";
import {
  calculateUrgency,
  getDaysRemaining,
  getUrgencyBadgeClasses,
  getPriorityClasses,
  getTypeClasses,
} from "@/lib/task-utils";



interface CalendarTaskProps {
  task: Task;
  onClick: () => void;
}

const priorityLabels: Record<TaskPriority, string> = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
};

const typeLabels: Record<TaskType, { icon: React.ReactNode; label: string }> = {
  Assignment: { icon: <Calendar className="h-3 w-3" />, label: "Assignment" },
  "Class Test": { icon: <FlaskConical className="h-3 w-3" />, label: "Class Test" },
};

export function CalendarTask({ task, onClick }: CalendarTaskProps) {
  const urgency = calculateUrgency(task.due_date, task.status);
  const daysRemaining = getDaysRemaining(task.due_date);
  const isOverdue = daysRemaining < 0;
  const isDueToday = daysRemaining === 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-lg p-1.5 border-0 bg-transparent shadow-none hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-[#8b7355] focus:ring-inset"
    >
      <div
        className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-sm border ${getTypeClasses(task.type)}`}
      >
        {typeLabels[task.type].icon}
        {typeLabels[task.type].label}
      </div>

      <div className="mt-1 space-y-1">
        <p className="text-xs font-semibold text-[#3d3429] leading-tight truncate pr-2">
          {task.title}
        </p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge
            variant="outline"
            className={`text-[9px] font-medium ${getPriorityClasses(task.priority)}`}
          >
            <Tag className="h-2.5 w-2.5 mr-0.5" />
            {priorityLabels[task.priority]}
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
      </div>
    </button>
  );
}
