import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Plus, X } from "lucide-react";
import { type EventType, type ReminderOption, EVENT_TYPES, REMINDER_OPTIONS } from "@/types/events";

type Event = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  event_type: EventType;
  event_date: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  event_url?: string;
  reminder?: ReminderOption;
  notes?: string;
  created_at: string;
  updated_at: string;
};

export { Event };
import { format, parseISO } from "date-fns";

interface EventFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: string;
  editEvent?: Event | null;
  onSubmit: (event: {
    title: string;
    description?: string;
    event_type: EventType;
    event_date: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    event_url?: string;
    reminder?: ReminderOption;
    notes?: string;
  }) => Promise<{ error: string | null }>;
}

export function EventForm({
  open,
  onOpenChange,
  selectedDate,
  editEvent,
  onSubmit,
}: EventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<EventType>("Other");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [eventUrl, setEventUrl] = useState("");
  const [reminder, setReminder] = useState<ReminderOption>("none");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("Other");
    setEventDate("");
    setStartTime("");
    setEndTime("");
    setLocation("");
    setEventUrl("");
    setReminder("none");
    setNotes("");
    setError(null);
  };

  const prefillForSelectedDate = () => {
    if (selectedDate) {
      setEventDate(selectedDate);
    }
  };

  const prefillFromEdit = () => {
    if (!editEvent) return;
    setTitle((editEvent as unknown as { title?: string }).title ?? "");
    setDescription((editEvent as unknown as { description?: string }).description ?? "");
    setEventType((editEvent as unknown as { event_type?: EventType }).event_type ?? "Other");
    setEventDate((editEvent as unknown as { event_date?: string }).event_date ?? "");
    setStartTime((editEvent as unknown as { start_time?: string }).start_time ?? "");
    setEndTime((editEvent as unknown as { end_time?: string }).end_time ?? "");
    setLocation((editEvent as unknown as { location?: string }).location ?? "");
    setEventUrl((editEvent as unknown as { event_url?: string }).event_url ?? "");
    setReminder(((editEvent as unknown as { reminder?: string }).reminder ?? "none") as ReminderOption);
    setNotes((editEvent as unknown as { notes?: string }).notes ?? "");
  };

  useEffect(() => {
    resetForm();
    if (open) {
      if (editEvent) prefillFromEdit();
    } else {
      prefillForSelectedDate();
    }
  }, [open]);

  const validateTimeRange = (): string | null => {
    if (!startTime || !endTime) return null;
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    if (!sh || !sm || !eh || !em) return null;
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    if (endMinutes <= startMinutes) {
      return "End time must be after start time.";
    }
    return null;
  };

  const validateUrl = (): string | null => {
    if (!eventUrl) return null;
    try {
      const url = new URL(eventUrl);
      if (!url.protocol.startsWith("http")) return "URL must start with http:// or https://";
      return null;
    } catch {
      return "Please enter a valid URL.";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!eventType) {
      setError("Event type is required.");
      return;
    }
    if (!eventDate) {
      setError("Date is required.");
      return;
    }
    if (!parseISO(eventDate).getTime()) {
      setError("Please select a valid date.");
      return;
    }

    const timeError = validateTimeRange();
    if (timeError) {
      setError(timeError);
      return;
    }

    const urlError = validateUrl();
    if (urlError) {
      setError(urlError);
      return;
    }

    setIsLoading(true);
    const result = await onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      event_type: eventType,
      event_date: eventDate,
      start_time: startTime || undefined,
      end_time: endTime || undefined,
      location: location.trim() || undefined,
      event_url: eventUrl.trim() || undefined,
      reminder,
      notes: notes.trim() || undefined,
    });

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else {
      resetForm();
      onOpenChange(false);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] bg-[#faf5ee] border-[#e8dfd2] shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#4a3f35]">
            {editEvent ? "Edit Event" : "Add Event"}
          </DialogTitle>
          <DialogDescription className="text-[#8b7355]">
            {editEvent ? "Update your event details." : "Add a study/work event to your calendar."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="event-title" className="text-[#5a4d3e]">
              Event Title *
            </Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Smart India Hackathon Registration"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#5a4d3e]">Event Type *</Label>
            <Select
              value={eventType}
              onValueChange={(value) => setEventType(value as EventType)}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-date" className="text-[#5a4d3e]">
              Date *
            </Label>
            <Input
              id="event-date"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-time" className="text-[#5a4d3e]">
                Start Time
              </Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-time" className="text-[#5a4d3e]">
                End Time
              </Label>
              <Input
                id="end-time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#5a4d3e]">
              Location / Venue
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Online, Building A, Room 204"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-url" className="text-[#5a4d3e]">
              Registration / Event URL
            </Label>
            <Input
              id="event-url"
              type="url"
              value={eventUrl}
              onChange={(e) => setEventUrl(e.target.value)}
              placeholder="https://..."
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[#5a4d3e]">Reminder</Label>
            <Select
              value={reminder}
              onValueChange={(value) => setReminder(value as ReminderOption)}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                {REMINDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-description" className="text-[#5a4d3e]">
              Description
            </Label>
            <Textarea
              id="event-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional event description"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff] min-h-[70px]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event-notes" className="text-[#5a4d3e]">
              Notes
            </Label>
            <Textarea
              id="event-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optional notes"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff] min-h-[70px]"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <X className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  {editEvent ? "Save Changes" : "Add Event"}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
