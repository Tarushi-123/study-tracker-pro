export type EventType =
  | "Hackathon"
  | "Workshop"
  | "Seminar"
  | "Competition"
  | "Club Event"
  | "College Event"
  | "Exam Deadline"
  | "Registration Deadline"
  | "Scholarship Deadline"
  | "Project Deadline"
  | "Internship Deadline"
  | "Other";

export type ReminderOption =
  | "none"
  | "on_the_day"
  | "1_day_before"
  | "2_days_before"
  | "1_week_before";

export interface EventFormValues {
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
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string;
  event_type: EventType;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  event_url: string | null;
  reminder: ReminderOption;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export const EVENT_TYPES: EventType[] = [
  "Hackathon",
  "Workshop",
  "Seminar",
  "Competition",
  "Club Event",
  "College Event",
  "Exam Deadline",
  "Registration Deadline",
  "Scholarship Deadline",
  "Project Deadline",
  "Internship Deadline",
  "Other",
];

export const REMINDER_OPTIONS: { value: ReminderOption; label: string }[] = [
  { value: "none", label: "No reminder" },
  { value: "on_the_day", label: "On the day" },
  { value: "1_day_before", label: "1 day before" },
  { value: "2_days_before", label: "2 days before" },
  { value: "1_week_before", label: "1 week before" },
];

export type UpdateEventInput = {
  title?: string;
  description?: string;
  event_type?: EventType;
  event_date?: string;
  start_time?: string | null;
  end_time?: string | null;
  location?: string | null;
  event_url?: string | null;
  reminder?: ReminderOption;
  notes?: string | null;
};
