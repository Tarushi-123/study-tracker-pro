import { useMemo, useState, useEffect, useRef } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  format,
  isBefore,
  startOfDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarDay } from "./CalendarDay";
import { CalendarFilters } from "./CalendarFilters";
import { CalendarLegend } from "./CalendarLegend";
import type { Task } from "@/types";
import type { Event, EventType } from "@/types/events";
import { isSameUTCDay } from "@/lib/task-utils";

type ItemFilter = "all" | "tasks" | "events";
type EventFilter = "all" | EventType;

interface CalendarProps {
  tasks: Task[];
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
  itemFilter: ItemFilter;
  onItemFilterChange: (value: ItemFilter) => void;
  eventFilter: EventFilter;
  onEventFilterChange: (value: EventFilter) => void;
  onDayClick: (date: Date) => void;
  onItemClick: (item: Task | Event) => void;
}

export function Calendar({
  tasks,
  events,
  isLoading,
  error,
  onRetry,
  itemFilter,
  onItemFilterChange,
  eventFilter,
  onEventFilterChange,
  onDayClick,
  onItemClick,
}: CalendarProps) {
  const [viewMonth, setViewMonth] = useState(() => startOfMonth(new Date()));
  const todayRef = useRef<Date | null>(null);

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

  const filteredByMonth = useMemo(() => {
    const start = startOfMonth(viewMonth);
    const end = endOfMonth(viewMonth);

    const filteredTasks = tasks.filter((task) => {
      const due = new Date(task.due_date);
      const dueStart = startOfDay(due);
      return (
        !isBefore(dueStart, start) &&
        !isBefore(dueStart, end) &&
        (itemFilter === "all" || itemFilter === "tasks")
      );
    });

    const filteredEvents = events.filter((event) => {
      const eventDate = new Date(event.event_date);
      const eventDateStart = startOfDay(eventDate);
      return (
        !isBefore(eventDateStart, start) &&
        !isBefore(eventDateStart, end) &&
        (itemFilter === "all" || itemFilter === "events")
      );
    });

    return {
      tasks: filteredTasks,
      events: filteredEvents,
    };
  }, [tasks, events, viewMonth, itemFilter]);

  const monthTaskMap = useMemo(() => {
    const map = new Map<string, Task[]>();
    filteredByMonth.tasks.forEach((task) => {
      const key = format(startOfDay(new Date(task.due_date)), "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, task]);
    });
    return map;
  }, [filteredByMonth.tasks]);

  const monthEventMap = useMemo(() => {
    const map = new Map<string, Event[]>();
    filteredByMonth.events.forEach((event) => {
      const key = format(startOfDay(new Date(event.event_date)), "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      map.set(key, [...existing, event]);
    });
    return map;
  }, [filteredByMonth.events]);

  const totalItemsInMonth = filteredByMonth.tasks.length + filteredByMonth.events.length;

  if (isLoading) {
    return (
      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4">
        <div className="h-10 w-48 bg-[#e8dfd2] rounded-lg animate-pulse mb-4" />
        <CalendarFilters
          itemFilter="all"
          onItemFilterChange={() => {}}
          eventFilter="all"
          onEventFilterChange={() => {}}
        />
        <div className="grid grid-cols-7 gap-2 mt-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-[#e8dfd2] rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-1">
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

      <CalendarFilters
        itemFilter={itemFilter}
        onItemFilterChange={onItemFilterChange}
        eventFilter={eventFilter}
        onEventFilterChange={onEventFilterChange}
      />

      <div className="bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] p-4">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-[#8b7355] py-2">
              {d}
            </div>
          ))}
        </div>

        {totalItemsInMonth === 0 ? (
          <div className="col-span-7 py-6 text-center text-sm text-[#8b7355]">
            No tasks or events scheduled for this month.
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const taskList = monthTaskMap.get(format(day, "yyyy-MM-dd")) ?? [];
              const eventList = monthEventMap.get(format(day, "yyyy-MM-dd")) ?? [];

              const filteredTaskList =
                itemFilter === "events" ? [] : taskList;
              const filteredEventList = itemFilter === "tasks" ? [] : eventList;
              const eventFilteredList =
                eventFilter === "all" ? filteredEventList : filteredEventList.filter(
                  (event) => event.event_type === eventFilter,
                );

              return (
                <CalendarDay
                  key={day.toISOString()}
                  day={day}
                  tasks={filteredTaskList}
                  events={eventFilteredList}
                  isOtherMonth={!isSameMonth(day, viewMonth)}
                  isToday={isSameMonth(day, today) && isToday(day)}
                  onDayClick={onDayClick}
                  onItemClick={onItemClick}
                />
              );
            })}
          </div>
        )}

        <div className="mt-2">
          <CalendarLegend />
        </div>
      </div>
    </div>
  );
}
