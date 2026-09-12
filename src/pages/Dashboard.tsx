import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, LogOut, LayoutDashboard, ListTodo } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "@/lib/tasks";
import { DashboardContent } from "@/components/DashboardContent";
import { TaskList } from "@/components/TaskList";
import { AddTaskForm } from "@/components/AddTaskForm";
import { EditTaskForm } from "@/components/EditTaskForm";
import { ReminderSystem } from "@/components/ReminderSystem";

type View = "overview" | "tasks";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [activeView, setActiveView] = useState<View>("overview");

  const fetchTasks = useCallback(async () => {
    setIsLoadingTasks(true);
    const { data } = await getTasks();
    if (data) {
      setTasks(data);
    }
    setIsLoadingTasks(false);
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await signOut();
    navigate("/");
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
    }
    return result;
  };

  const getUserDisplayName = () => {
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "Student";
  };

  return (
    <div className="min-h-screen bg-[#f0e6d8]">
      {/* Header */}
      <header className="bg-[#faf5ee] border-b border-[#e8dfd2] shadow-[0_4px_8px_#d4c9ba] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-[#8b7355] to-[#a69580] flex items-center justify-center shadow-[2px_2px_4px_#d4c9ba,-2px_-2px_4px_#ffffff]">
                <span className="text-sm sm:text-lg font-bold text-white">S</span>
              </div>
              <div>
                <h1 className="text-base sm:text-xl font-bold text-[#3d3429]">StudyPro</h1>
                <p className="text-[10px] sm:text-xs text-[#8b7355] hidden sm:block">
                  {getUserDisplayName()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs text-[#8b7355] hidden md:block">
                {user?.email}
              </span>
              <Button
                onClick={handleSignOut}
                disabled={isSigningOut}
                variant="ghost"
                size="sm"
                className="text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2]"
              >
                {isSigningOut ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Section Navigation Tabs */}
      <div className="bg-[#faf5ee] border-b border-[#e8dfd2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveView("overview")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === "overview"
                  ? "border-[#8b7355] text-[#3d3429]"
                  : "border-transparent text-[#8b7355] hover:text-[#5a4d3e] hover:border-[#d4c9ba]"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveView("tasks")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeView === "tasks"
                  ? "border-[#8b7355] text-[#3d3429]"
                  : "border-transparent text-[#8b7355] hover:text-[#5a4d3e] hover:border-[#d4c9ba]"
              }`}
            >
              <ListTodo className="h-4 w-4" />
              Tasks
              {tasks.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold bg-[#e8dfd2] text-[#8b7355] rounded-full">
                  {tasks.filter((t) => t.status !== "completed").length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoadingTasks ? (
          <div className="space-y-6">
            {/* Skeleton for greeting */}
            <div className="space-y-2">
              <div className="h-8 w-64 bg-[#e8dfd2] rounded-lg animate-pulse" />
              <div className="h-4 w-48 bg-[#e8dfd2] rounded-lg animate-pulse" />
            </div>

            {/* Skeleton for urgent cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="h-40 bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] animate-pulse" />
              <div className="h-40 bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] animate-pulse" />
            </div>

            {/* Skeleton for other sections */}
            <div className="h-32 bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 h-48 bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] animate-pulse" />
              <div className="h-48 bg-[#faf5ee] rounded-2xl border border-[#e8dfd2] animate-pulse" />
            </div>
          </div>
        ) : activeView === "overview" ? (
          <div className="space-y-6">
            <DashboardContent tasks={tasks} />
            <ReminderSystem tasks={tasks} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Task Button */}
            <div className="flex justify-end">
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>

            {/* Task List */}
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
              onUpdateStatus={async (taskId: string, status: TaskStatus) => {
                return handleUpdateTask(taskId, { status });
              }}
              onAddTask={() => setShowAddForm(true)}
            />
          </div>
        )}
      </main>

      {/* Add Task Form */}
      <AddTaskForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={handleCreateTask}
      />

      {/* Edit Task Form */}
      <EditTaskForm
        open={editingTask !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTask(null);
        }}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
}
