import { useMemo, useState, useEffect, useRef } from "react";
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isToday, format, isBefore, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";
import { CalendarLegend } from "./CalendarLegend";
import type { Task } from "@/types";
import { isSameUTCDay } from "@/lib/task-utils";

interface CalendarProps {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  onDayClick: (date: Date) => void;
  onTaskClick: (task: Task) => void;
}

export function Calendar({
  tasks,
  isLoading,
  error,
  onRetry,
  onDayClick,
  onTaskClick,
}: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const todayRef = useRef<Date | null>(null);

  // Recompute today once per mount for stable "today" highlighting
  useEffect(() => {
    todayRef.current = new Date();
  }, []);

  const today = todayRef.current ?? new Date();

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(viewMonth);
    const monthEnd = endOfMonth(viewMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days: Date[] = [];
    let current = calendarStart;
    while (current <= calendarEnd) {
      days.push(current);
      current = addDays(current, 1);
    }
    return days;
  }, [viewMonth]);

  const monthTaskMap = useMemo(() => {
    const map = new Map<string, Task[]>();
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);
    tasks.forEach((task) => {
      const due = new Date(task.due_date);
      const dueStart = startOfDay(due);
      if (!isBefore(dueStart, start) && !isBefore(dueStart, end)) {
        const key = format(dueStart, "yyyy-MM-dd");
        const existing = map.get(key) ?? [];
        map.set(key, [...existing, task]);
      }
    });
    return map;
  }, [tasks, viewMonth]);

  if (isLoading) {
    return (
      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4">
        <div className="h-10 w-48 bg-[#e8dfd2] rounded-lg animate-pulse mb-4" />
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-[#e8dfd2] rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-2">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="h-24 bg-[#e8dfd2] rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-6 text-center">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <Button onClick={onRetry} className="bg-[#8b7355] hover:bg-[#6b5b47] text-white">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentMonth={viewMonth}
        onPreviousMonth={() => setViewMonth((m) => subMonths(m, 1))}
        onNextMonth={() => setViewMonth((m) => addMonths(m, 1))}
        onToday={() => setViewMonth(startOfMonth(today))}
      />

      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div
              key={d}
              className="text-center text-xs font-semibold text-[#8b7355] py-2"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const taskList = monthTaskMap.get(format(day, "yyyy-MM-dd")) ?? [];
            return (
              <CalendarDay
                key={day.toISOString()}
                day={day}
                tasks={taskList}
                isOtherMonth={!isSameMonth(day, viewMonth)}
                isToday={isSameMonth(day, today) && isToday(day)}
                onDayClick={onDayClick}
                onTaskClick={onTaskClick}
              />
            );
          })}
        </div>

        <div className="mt-2">
          <CalendarLegend />
        </div>
      </div>
    </div>
  );
}
