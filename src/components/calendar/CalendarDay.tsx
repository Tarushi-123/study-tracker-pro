import { useState } from "react";
import { format, parseISO } from "date-fns";
import type { Task } from "@/types";
import type { Event } from "@/types/events";
import { CalendarItem } from "./CalendarItem";
import { isSameUTCDay } from "@/lib/task-utils";

interface CalendarDayProps {
  day: Date;
  tasks: Task[];
  events: Event[];
  isOtherMonth: boolean;
  isToday: boolean;
  onDayClick: (date: Date) => void;
  onItemClick: (item: Task | Event) => void;
}

export function CalendarDay({
  day,
  tasks,
  events,
  isOtherMonth,
  isToday,
  onDayClick,
  onItemClick,
}: CalendarDayProps) {
  const dayNumber = day.getUTCDate();

  const monthlyTasks = tasks.filter((task) => isSameUTCDay(day, parseISO(task.due_date)));
  const monthlyEvents = events.filter(
    (event) => isSameUTCDay(day, parseISO(event.event_date)),
  );

  const items = [...monthlyTasks, ...monthlyEvents];

  return (
    <div
      className={`relative flex flex-col min-h-0 p-1 border rounded-xl bg-white/40 ${
        isOtherMonth ? "opacity-40 pointer-events-none" : ""
      } ${isToday ? "bg-[#fff6e9]" : ""}`}
    >
      {isToday && (
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 h-1.5 w-5 rounded-full bg-[#8b7355] shadow-[0_1px_2px_#d4c9ba]" />
      )}

      <button
        type="button"
        onClick={() => onDayClick(day)}
        className={`relative z-10 text-sm font-semibold w-full text-center py-0.5 rounded-lg border-0 bg-transparent shadow-none hover:bg-white/70 focus:outline-none ${
          isOtherMonth
            ? "text-[#c4b8a8]"
            : isToday
              ? "text-[#8b7355]"
              : "text-[#3d3429]"
        }`}
      >
        {dayNumber}
      </button>

      <div className="mt-0.5 space-y-0.5 overflow-y-auto max-h-[calc(100%-2rem)]">
        {items.map((item) => (
          <CalendarItem key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </div>
  );
}
