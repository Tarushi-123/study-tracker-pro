import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { format, startOfDay, endOfDay, addDays } from "date-fns";
import { Calendar } from "@/components/calendar/Calendar";
import { CalendarFilters } from "@/components/calendar/CalendarFilters";
import { UpcomingItems } from "@/components/calendar/UpcomingItems";
import { EventForm } from "@/components/calendar/EventForm";
import { EventDetailsModal } from "@/components/calendar/EventDetailsModal";
import { AddTaskForm } from "@/components/AddTaskForm";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, PanelRight } from "lucide-react";
import type { Task } from "@/types";
import type { Event, EventType } from "@/types/events";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/tasks";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  type UpdateEventInput,
} from "@/hooks/use-events";


type ItemFilter = "all" | "tasks" | "events";
type EventFilter = "all" | EventType;

type CalendarView = "calendar" | "task-form" | "event-form" | "date-picker";
type ItemDetail = { kind: "task"; item: Task } | { kind: "event"; item: Event } | null;

export default function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<CalendarView>("calendar");
  const [itemDetail, setItemDetail] = useState<ItemDetail>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [itemFilter, setItemFilter] = useState<ItemFilter>("all");
  const [eventFilter, setEventFilter] = useState<EventFilter>("all");
  const [isEventDeleting, setIsEventDeleting] = useState(false);
  const [isTaskDeleting, setIsTaskDeleting] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [taskRes, eventRes] = await Promise.all([
        getTasks(),
        getEvents(),
      ]);
      if (taskRes.error) setError(taskRes.error);
      if (eventRes.error && !error) setError(eventRes.error);
      setTasks(taskRes.data ?? []);
      setEvents(eventRes.data ?? []);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    await fetchAll();
  };

  const refetch = async () => {
    await fetchAll();
  };

  const handleCreateTask = async (taskData: Parameters<typeof createTask>[0]) => {
    const result = await createTask(taskData);
    if (!result.error && result.data) {
      setTasks((prev) => [...prev, result.data!]);
    }
    return result;
  };

  const handleUpdateTask = async (
    taskId: string,
    updates: Parameters<typeof updateTask>[1],
  ) => {
    const result = await updateTask(taskId, updates);
    if (!result.error && result.data) {
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? result.data! : t)),
      );
    }
    return result;
  };

  const handleDeleteTask = async (taskId: string) => {
    const result = await deleteTask(taskId);
    if (!result.error) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      if (itemDetail?.kind === "task" && itemDetail.item.id === taskId) {
        setItemDetail(null);
      }
    }
    return result;
  };

  const handleCreateEvent = async (eventData: {
    title: string;
    description?: string;
    event_type: EventType;
    event_date: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    event_url?: string;
    reminder?: "none" | "on_the_day" | "1_day_before" | "2_days_before" | "1_week_before";
    notes?: string;
  }) => {
    const result = await createEvent(eventData);
    if (!result.error && result.data) {
      setEvents((prev) => [...prev, result.data!]);
    }
    return result;
  };

  const handleUpdateEvent = async (
    eventId: string,
    input: UpdateEventInput,
  ) => {
    const result = await updateEvent(eventId, input);
    if (!result.error && result.data) {
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? result.data! : e)),
      );
    }
    return result;
  };

  const handleDeleteEvent = async (eventId: string) => {
    const result = await deleteEvent(eventId);
    if (!result.error) {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      if (itemDetail?.kind === "event" && itemDetail.item.id === eventId) {
        setItemDetail(null);
      }
    }
    return result;
  };

  const openDatePicker = (date: Date) => {
    setSelectedDate(date);
    setActiveView("date-picker");
  };

  const openAddTask = () => {
    setActiveView("task-form");
  };

  const openAddEvent = () => {
    setActiveView("event-form");
  };

  const closeAddFlow = () => {
    setActiveView("calendar");
    setSelectedDate(null);
    setShowAddForm(false);
    setShowEventForm(false);
  };

  const openTaskDetail = (task: Task) => {
    setItemDetail({ kind: "task", item: task });
  };

  const openEventDetail = (event: Event) => {
    setItemDetail({ kind: "event", item: event });
  };

  const handleItemClick = (item: Task | Event) => {
    if ("type" in item && "priority" in item) {
      openTaskDetail(item as Task);
    } else {
      openEventDetail(item as Event);
    }
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    return handleUpdateTask(taskId, { status });
  };

  const handlePriorityChange = async (taskId: string, priority: Task["priority"]) => {
    return handleUpdateTask(taskId, { priority });
  };

  return (
    <div className="min-h-screen bg-[#f0e6d8]">
      <header className="bg-[#faf5ee] border-b border-[#e8dfd2] shadow-[0_4px_8px_#d4c9ba] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center shadow-[2px_2px_4px_#d4c9ba,-2px_-2px_4px_#ffffff]">
                <CalendarIcon className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-[#3d3429]">Calendar</h1>
                <p className="text-[10px] sm:text-xs text-[#8b7355] hidden sm:block">
                  Tasks and events on one timeline
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                size="sm"
                className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
              >
                <PanelRight className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  className="bg-[#8b7355] hover:bg-[#6b5b47] text-white gap-1"
                  onClick={() => {
                    setSelectedDate(new Date());
                    setActiveView("date-picker");
                  }}
                >
                  <Plus className="h-4 w-4" />
                  + Add
                </Button>
              </div>
            </div>

            <Calendar
              tasks={tasks}
              events={events}
              isLoading={isLoading}
              error={error}
              onRetry={handleRetry}
              itemFilter={itemFilter}
              onItemFilterChange={setItemFilter}
              eventFilter={eventFilter}
              onEventFilterChange={setEventFilter}
              onDayClick={openDatePicker}
              onItemClick={handleItemClick}
            />
          </div>

          <div>
            <UpcomingItems
              tasks={tasks}
              events={events}
              onItemClick={handleItemClick}
            />
          </div>
        </div>
      </main>

      {/* Add Task / Event choice */}
      {activeView === "date-picker" && selectedDate && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
          <div
            className="w-full max-w-sm bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff] p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-[#3d3429] mb-3">
              Add to{" "}
              {format(startOfDay(selectedDate), "EEEE, MMMM d, yyyy")}
            </h3>
            <div className="space-y-2">
              <Button
                className="w-full bg-[#8b7355] hover:bg-[#6b5b47] text-white justify-start gap-2"
                onClick={() => {
                  setShowAddForm(true);
                  closeAddFlow();
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                Add Task
              </Button>
              <Button
                variant="outline"
                className="w-full bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] justify-start gap-2"
                onClick={() => {
                  setShowEventForm(true);
                  closeAddFlow();
                }}
              >
                <CalendarIcon className="h-4 w-4" />
                Add Event
              </Button>
            </div>
            <Button
              variant="ghost"
              className="mt-3 w-full text-[#8b7355] hover:bg-[#e8dfd2]"
              onClick={closeAddFlow}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Add Task Form */}
      <AddTaskForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={async (taskData) => {
          const result = await handleCreateTask({
            ...taskData,
            due_date: format(selectedDate ?? new Date(), "yyyy-MM-dd"),
          });
          refetch();
          return result;
        }}
      />

      {/* Add Event Form */}
      <EventForm
        open={showEventForm}
        onOpenChange={setShowEventForm}
        selectedDate={selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined}
        onSubmit={async (eventData) => {
          const result = await handleCreateEvent({
            ...eventData,
            event_date: eventData.event_date || format(selectedDate ?? new Date(), "yyyy-MM-dd"),
          });
          refetch();
          return result;
        }}
      />

      {/* Task detail from calendar */}
      {itemDetail?.kind === "task" && (
        <TaskDetailModal
          task={itemDetail.item}
          onClose={() => setItemDetail(null)}
          onEdit={(task) => {
            setItemDetail(null);
            navigate("/dashboard", { state: { editingTask: task } });
          }}
          onDelete={async (taskId) => {
            setIsTaskDeleting(true);
            const result = await handleDeleteTask(taskId);
            setIsTaskDeleting(false);
            refetch();
            return result;
          }}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />
      )}

      {/* Event detail from calendar */}
      {itemDetail?.kind === "event" && (
        <EventDetailsModal
          event={itemDetail.item}
          onClose={() => setItemDetail(null)}
          onEdit={(event) => {
            setItemDetail(null);
            setShowEventForm(true);
            navigate(0);
          }}
          onDelete={async (eventId) => {
            setIsEventDeleting(true);
            const result = await handleDeleteEvent(eventId);
            setIsEventDeleting(false);
            refetch();
            return result;
          }}
          onUpdate={handleUpdateEvent}
        />
      )}
    </div>
  );
}

function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: {
  task: Task;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<{ error: string | null }>;
  onStatusChange: (taskId: string, status: Task["status"]) => Promise<{ error: string | null }>;
  onPriorityChange: (taskId: string, priority: Task["priority"]) => Promise<{ error: string | null }>;
}) {
  const isDeleting = true;
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
          <h2 className="text-lg font-semibold text-[#3d3429] truncate pr-2">{task.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-[#8b7355] hover:bg-[#e8dfd2]"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <p className="text-sm text-[#8b7355]">Subject</p>
            <p className="text-sm font-semibold text-[#3d3429] mt-0.5">{task.subject}</p>
          </div>
          <div>
            <p className="text-sm text-[#8b7355]">Type</p>
            <p className="text-sm font-semibold text-[#3d3429] mt-0.5">
              {task.type === "Assignment" ? "📝 Assignment" : "🧪 Class Test"}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#8b7355]">Due Date</p>
            <p className="text-sm font-semibold text-[#3d3429] mt-0.5">
              {format(new Date(task.due_date), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <div>
            <p className="text-sm text-[#8b7355]">Priority</p>
            <p className="text-sm font-semibold text-[#3d3429] mt-0.5">{task.priority}</p>
          </div>
          <div>
            <p className="text-sm text-[#8b7355]">Status</p>
            <p className="text-sm font-semibold text-[#3d3429] mt-0.5">{task.status}</p>
          </div>
          {task.description && (
            <div className="space-y-1">
              <p className="text-sm text-[#8b7355]">Description</p>
              <p className="text-sm text-[#3d3429] whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Button
                className="flex-1 bg-[#8b7355] hover:bg-[#6b5b47] text-white"
                onClick={() => onStatusChange(task.id, nextStatus(task.status))}
              >
                {task.status === "Not Started"
                  ? "Mark In Progress"
                  : task.status === "In Progress"
                    ? "Mark Completed"
                    : "Reset Status"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
                onClick={() => onPriorityChange(task.id, nextPriority(task.priority))}
              >
                Cycle Priority
              </Button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                className="flex-1 bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
                onClick={() => {
                  onClose();
                  onEdit(task);
                }}
              >
                Edit Task
              </Button>
              <Button
                variant="ghost"
                className="flex-1 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                onClick={async () => {
                  await onDelete(task.id);
                  onClose();
                  refetch();
                }}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function nextStatus(current: Task["status"]): Task["status"] {
  if (current === "Not Started") return "In Progress";
  if (current === "In Progress") return "Completed";
  return "Not Started";
}

function nextPriority(current: Task["priority"]): Task["priority"] {
  if (current === "Low") return "Medium";
  if (current === "Medium") return "High";
  return "Low";
}

async function refetch(): Promise<void> {
  // no-op placeholder; real logic lives on parent; kept for TS safety
}
