import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Task } from "@/types";
import type { TaskStatus, TaskPriority } from "@/types";
import { nextStatus, nextPriority } from "@/lib/task-utils";



interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<{ error: string | null }>;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  onPriorityChange: (taskId: string, priority: Task["priority"]) => void;
}

export function TaskDetailModal({
  task,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onPriorityChange,
}: TaskDetailModalProps) {
  if (!task) return null;

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
            <X className="h-4 w-4" />
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
              {format(parseISO(task.due_date), "EEEE, MMMM d, yyyy")}
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
                onClick={() => onStatusChange(task.id, nextStatus(task.status) as TaskStatus)}
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
                onClick={() => onPriorityChange(task.id, nextPriority(task.priority) as TaskPriority)}
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

function refetch(): void {
  // noop
}
