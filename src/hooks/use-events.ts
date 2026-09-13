import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Event, EventType, ReminderOption } from "@/types/events";

export async function getEvents(): Promise<{ data: Event[] | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })
    .order("event_date", { ascending: true, nullsFirst: false });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function getEventsForMonth(
  year: number,
  month: number,
): Promise<{ data: Event[] | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: [], error: null };

  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", start.toISOString().slice(0, 10))
    .lte("event_date", end.toISOString().slice(0, 10))
    .order("event_date", { ascending: true });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

interface CreateEventInput {
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

export async function createEvent(input: CreateEventInput): Promise<{ data: Event | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase is not configured." };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "Not authenticated" };

  const { data, error } = await supabase.from("events").insert({
    user_id: user.id,
    title: input.title.trim(),
    description: (input.description ?? "").trim(),
    event_type: input.event_type,
    event_date: input.event_date,
    start_time: input.start_time ?? null,
    end_time: input.end_time ?? null,
    location: input.location ?? null,
    event_url: input.event_url ?? null,
    reminder: input.reminder ?? "none",
    notes: input.notes ?? null,
  }).select().single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

interface UpdateEventInput {
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
}

export async function updateEvent(
  eventId: string,
  input: UpdateEventInput,
): Promise<{ data: Event | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase is not configured." };

  const { data, error } = await supabase
    .from("events")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export async function deleteEvent(eventId: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured) return { error: "Supabase is not configured." };

  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
