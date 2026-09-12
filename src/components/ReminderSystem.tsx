import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Clock, AlertCircle, CalendarClock } from "lucide-react";
import type { Task, UrgencyLevel } from "@/types";
import {
  calculateUrgency,
  getDaysRemaining,
} from "@/lib/task-utils";

interface ReminderSystemProps {
  tasks: Task[];
}

interface UrgencyGroup {
  level: UrgencyLevel;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  tasks: Task[];
}

export function ReminderSystem({ tasks }: ReminderSystemProps) {
  const urgencyGroups = useMemo(() => {
    const activeTasks = tasks.filter((t) => t.status !== "completed");

    const groups: Record<UrgencyLevel, Task[]> = {
      overdue: [],
      due_today: [],
      due_tomorrow: [],
      due_soon: [],
      completed: [],
      normal: [],
    };

    activeTasks.forEach((task) => {
      const urgency = calculateUrgency(task.due_date, task.status);
      groups[urgency].push(task);
    });

    // Sort each group by due date
    Object.keys(groups).forEach((key) => {
      const level = key as UrgencyLevel;
      groups[level].sort(
        (a, b) =>
          new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
      );
    });

    const result: UrgencyGroup[] = [
      {
        level: "overdue",
        label: "Overdue",
        icon: <AlertTriangle className="h-4 w-4" />,
        color: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        tasks: groups.overdue,
      },
      {
        level: "due_today",
        label: "Due Today",
        icon: <AlertCircle className="h-4 w-4" />,
        color: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        tasks: groups.due_today,
      },
      {
        level: "due_tomorrow",
        label: "Due Tomorrow",
        icon: <Clock className="h-4 w-4" />,
        color: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        tasks: groups.due_tomorrow,
      },
      {
        level: "due_soon",
        label: "Due Soon (3 days)",
        icon: <CalendarClock className="h-4 w-4" />,
        color: "text-amber-700",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        tasks: groups.due_soon,
      },
    ];

    return result.filter((g) => g.tasks.length > 0);
  }, [tasks]);

  const totalUrgent = urgencyGroups.reduce(
    (sum, g) => sum + g.tasks.length,
    0,
  );

  if (totalUrgent === 0) {
    return (
      <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#3d3429] flex items-center gap-2">
            <Bell className="h-5 w-5 text-[#8b7355]" />
            Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
              <span className="text-xl">🎉</span>
            </div>
            <p className="text-sm font-medium text-[#3d3429]">
              All clear!
            </p>
            <p className="text-xs text-[#8b7355] mt-1">
              No urgent tasks at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-[#3d3429] flex items-center gap-2">
          <Bell className="h-5 w-5 text-[#8b7355]" />
          Reminders
          <Badge
            variant="outline"
            className="ml-auto text-xs bg-red-100 text-red-700 border-red-200"
          >
            {totalUrgent} urgent
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {urgencyGroups.map((group) => (
          <div key={group.level}>
            <div className={`flex items-center gap-2 mb-2`}>
              <span className={group.color}>{group.icon}</span>
              <h4 className={`text-sm font-semibold ${group.color}`}>
                {group.label}
              </h4>
              <span className="text-xs text-[#8b7355]">
                ({group.tasks.length})
              </span>
            </div>
            <div className="space-y-2">
              {group.tasks.map((task) => {
                const daysLeft = getDaysRemaining(task.due_date);
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 ${group.bgColor} rounded-xl border ${group.borderColor} shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#3d3429] truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#8b7355]">
                        {task.subject} •{" "}
                        {task.type === "assignment" ? "📝" : "🧪"}{" "}
                        {task.type === "assignment" ? "Assignment" : "Class Test"}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ml-2 whitespace-nowrap ${
                        group.level === "overdue"
                          ? "bg-gray-100 text-gray-700 border-gray-200"
                          : group.level === "due_today"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : group.level === "due_tomorrow"
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                      }`}
                    >
                      {daysLeft < 0
                        ? `${Math.abs(daysLeft)}d overdue`
                        : daysLeft === 0
                          ? "Today"
                          : daysLeft === 1
                            ? "Tomorrow"
                            : `${daysLeft}d left`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
