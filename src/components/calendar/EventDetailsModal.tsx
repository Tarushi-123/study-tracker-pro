import { format, parseISO } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2, Pencil, Calendar, Link, X } from "lucide-react";
import type { Event, EventType } from "@/types/events";
import { EVENT_TYPES } from "@/types/events";
import { getEventTypeColor } from "@/lib/calendar-utils";

interface EventDetailsModalProps {
  event: Event | null;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => Promise<{ error: string | null }>;
  onUpdate: (
    eventId: string,
    input: Parameters<typeof import("@/hooks/use-events").updateEvent>[1],
  ) => Promise<{ error: string | null }>;
}

export function EventDetailsModal({
  event,
  onClose,
  onEdit,
  onDelete,
  onUpdate,
}: EventDetailsModalProps) {
  if (!event) return null;

  const handleDelete = async () => {
    const result = await onDelete(event.id);
    if (!result.error) {
      onClose();
    }
    return result;
  };

  const cycleReminder = () => {
    const order: ReminderOption[] = [
      "none",
      "on_the_day",
      "1_day_before",
      "2_days_before",
      "1_week_before",
    ];
    const next = order[(order.indexOf(event.reminder) + 1) % order.length];
    onUpdate(event.id, { reminder: next });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#e8dfd2] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[#3d3429] truncate pr-2">
            {event.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#8b7355] hover:bg-[#e8dfd2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`text-xs font-medium ${getEventTypeColor(event.event_type)}`}
            >
              {event.event_type}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#5a4d3e] text-xs">Date</Label>
              <p className="text-sm text-[#3d3429] mt-1">
                {format(parseISO(event.event_date), "EEEE, MMMM d, yyyy")}
              </p>
            </div>
            <div>
              <Label className="text-[#5a4d3e] text-xs">Reminder</Label>
              <p className="text-sm text-[#3d3429] mt-1 capitalize">
                {event.reminder === "none"
                  ? "No reminder"
                  : event.reminder === "on_the_day"
                    ? "On the day"
                    : event.reminder === "1_day_before"
                      ? "1 day before"
                      : event.reminder === "2_days_before"
                        ? "2 days before"
                        : "1 week before"}
              </p>
            </div>
          </div>

          {(event.start_time || event.end_time) && (
            <div className="flex items-center gap-2 text-sm text-[#5a4d3e]">
              {event.start_time && (
                <>
                  <Calendar className="h-3.5 w-3.5" />
                  {format(parseISO(`2000-01-01T${event.start_time}Z`), "h:mm a")}
                  {event.end_time && <span className="text-[#8b7355]"> - </span>}
                </>
              )}
              {event.end_time && (
                <>
                  {format(parseISO(`2000-01-01T${event.end_time}Z`), "h:mm a")}
                </>
              )}
            </div>
          )}

          {event.description && (
            <Textarea
              value={event.description}
              readOnly
              className="bg-[#f0e6d8] border-[#e0d5c5] text-sm resize-none"
              rows={3}
            />
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-[#5a4d3e] text-xs">Location</Label>
              <p className="text-sm text-[#3d3429] mt-1">
                {event.location ?? "—"}
              </p>
            </div>
            <div>
              <Label className="text-[#5a4d3e] text-xs">Registration URL</Label>
              <div className="mt-1">
                {event.event_url ? (
                  <a
                    href={event.event_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-[#8b7355] underline hover:text-[#5a4d3e]"
                  >
                    <Link className="h-3.5 w-3.5" />
                    Open Link
                  </a>
                ) : (
                  <span className="text-sm text-[#b9a98f]">—</span>
                )}
              </div>
            </div>
          </div>

          {event.notes && (
            <div className="space-y-1">
              <Label className="text-[#5a4d3e] text-xs">Notes</Label>
              <p className="text-sm text-[#3d3429] whitespace-pre-wrap">
                {event.notes}
              </p>
            </div>
          )}

          <Separator className="border-[#e8dfd2]" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-[#8b7355] hover:bg-[#6b5b47] text-white"
                onClick={() => onEdit(event)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit Event
              </Button>
              <Button
                variant="ghost"
                className="flex-1 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>

            <Button
              variant="outline"
              className="justify-start bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
              onClick={cycleReminder}
            >
              Cycle Reminder
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ReminderOption =
  | "none"
  | "on_the_day"
  | "1_day_before"
  | "2_days_before"
  | "1_week_before";
