import { useState } from "react";
import { useNavigate } from "react-router";
import { Calendar } from "@/components/calendar/Calendar";
import { AddTaskForm } from "@/components/AddTaskForm";
import type { Task } from "@/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/tasks";
import { format } from "date-fns";
import { Loader2, Trash2, Pencil, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

type View = "calendar" | "task";

export default function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activeView, setActiveView] = useState<View>("calendar");
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await getTasks();
      if (fetchError) {
        setError(fetchError);
        setTasks([]);
      } else {
        setTasks(data ?? []);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = async () => {
    await fetchTasks();
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
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
        setActiveView("calendar");
      }
    }
    return result;
  };

  const openAddTaskForDate = (date: Date) => {
    setSelectedDate(date);
    setShowAddForm(true);
    setActiveView("calendar");
  };

  const openTaskDetail = (task: Task) => {
    setSelectedTask(task);
    setActiveView("task");
  };

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    const result = await handleUpdateTask(taskId, { status });
    return result;
  };

  const handlePriorityChange = async (taskId: string, priority: Task["priority"]) => {
    const result = await handleUpdateTask(taskId, { priority });
    return result;
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
                  See your study schedule at a glance
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
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Calendar
          tasks={tasks}
          isLoading={isLoading}
          error={error}
          onRetry={handleRetry}
          onDayClick={openAddTaskForDate}
          onTaskClick={openTaskDetail}
        />
      </main>

      {/* Add Task Form */}
      <AddTaskForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={async (taskData) => {
          const result = await handleCreateTask({
            ...taskData,
            due_date: format(selectedDate ?? new Date(), "yyyy-MM-dd"),
          });
          setShowAddForm(false);
          setSelectedDate(null);
          return result;
        }}
      />

      {/* Task Detail Modal */}
      {selectedTask && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => {
            setSelectedTask(null);
            setActiveView("calendar");
          }}
        >
          <div
            className="w-full max-w-lg bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] shadow-[12px_12px_24px_#d4c9ba,-12px_-12px_24px_#ffffff] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#e8dfd2] flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#3d3429] truncate pr-2">
                {selectedTask.title}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-[#8b7355] hover:bg-[#e8dfd2]"
                  onClick={() => setActiveView("calendar")}
                >
                  <Loader2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="px-5 py-4 space-y-4">
              {selectedTask.description && (
                <Textarea
                  value={selectedTask.description}
                  readOnly
                  className="bg-[#f0e6d8] border-[#e0d5c5] text-sm resize-none"
                  rows={3}
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#5a4d3e] text-xs">Subject</Label>
                  <p className="text-sm text-[#3d3429] mt-1">{selectedTask.subject}</p>
                </div>
                <div>
                  <Label className="text-[#5a4d3e] text-xs">Type</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {selectedTask.type === "Assignment" ? "📝 Assignment" : "🧪 Class Test"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-[#5a4d3e] text-xs">Due Date</Label>
                  <p className="text-sm text-[#3d3429] mt-1">
                    {format(new Date(selectedTask.due_date), "EEEE, MMMM d, yyyy")}
                  </p>
                </div>
                <div>
                  <Label className="text-[#5a4d3e] text-xs">Priority</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-xs"
                      style={{
                        borderColor:
                          selectedTask.priority === "High"
                            ? "#fda4af"
                            : selectedTask.priority === "Medium"
                              ? "#fcd34d"
                              : "#93c5fd",
                      }}
                    >
                      {selectedTask.priority}
                    </Badge>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-[#5a4d3e] text-xs">Status</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedTask.status}
                  </Badge>
                </div>
              </div>

              <Separator className="border-[#e8dfd2]" />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    className="flex-1 bg-[#8b7355] hover:bg-[#6b5b47] text-white"
                    onClick={() => {
                      if (selectedTask) {
                        handleUpdateTask(selectedTask.id, {
                          status:
                            selectedTask.status === "Not Started"
                              ? "In Progress"
                              : selectedTask.status === "In Progress"
                                ? "Completed"
                                : "Not Started",
                        });
                      }
                    }}
                  >
                    {selectedTask.status === "Not Started"
                      ? "Mark In Progress"
                      : selectedTask.status === "In Progress"
                        ? "Mark Completed"
                        : "Reset Status"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
                    onClick={() => {
                      if (selectedTask) {
                        const next =
                          selectedTask.priority === "Low"
                            ? "Medium"
                            : selectedTask.priority === "Medium"
                              ? "High"
                              : "Low";
                        handlePriorityChange(selectedTask.id, next);
                      }
                    }}
                  >
                    Cycle Priority
                  </Button>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
                    onClick={() => {
                      const task = selectedTask;
                      setSelectedTask(null);
                      setActiveView("calendar");
                      navigate("/dashboard", { state: { editingTask: task } });
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit Task
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex-1 bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    onClick={async () => {
                      if (!selectedTask) return;
                      setIsDeleting(true);
                      await handleDeleteTask(selectedTask.id);
                      setSelectedTask(null);
                      setActiveView("calendar");
                      setIsDeleting(false);
                    }}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-1" />
                    )}
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
