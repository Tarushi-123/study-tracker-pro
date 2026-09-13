import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { EventType } from "@/types/events";
import { EVENT_TYPES } from "@/types/events";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ItemFilter = "all" | "tasks" | "events";
type EventFilter = "all" | EventType;

interface CalendarFiltersProps {
  itemFilter: ItemFilter;
  onItemFilterChange: (value: ItemFilter) => void;
  eventFilter: EventFilter;
  onEventFilterChange: (value: EventFilter) => void;
}

export function CalendarFilters({
  itemFilter,
  onItemFilterChange,
  eventFilter,
  onEventFilterChange,
}: CalendarFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 shrink-0">
        <Select value={itemFilter} onValueChange={(value) => onItemFilterChange(value as ItemFilter)}>
          <SelectTrigger className="w-[120px] shrink-0 bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
            <SelectValue placeholder="Item Type" />
          </SelectTrigger>
          <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="tasks">Tasks</SelectItem>
            <SelectItem value="events">Events</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] shrink-0"
          >
            {eventFilter === "all" ? "All Events" : eventFilter}
            <X className="h-3 w-3 ml-1" />
          </Button>

          {mobileOpen && (
            <div className="absolute top-full left-0 z-20 w-56 bg-[#faf5ee] border border-[#e8dfd2] rounded-xl shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff] p-1">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    onEventFilterChange(type);
                    setMobileOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    eventFilter === type
                      ? "bg-[#e8dfd2] text-[#5a4d3e]"
                      : "hover:bg-[#e8dfd2] text-[#3d3429]"
                  }`}
                >
                  {type}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  onEventFilterChange("all");
                  setMobileOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  eventFilter === "all"
                    ? "bg-[#e8dfd2] text-[#5a4d3e]"
                    : "hover:bg-[#e8dfd2] text-[#3d3429]"
                }`}
              >
                All Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
