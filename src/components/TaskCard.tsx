import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Calendar, Clock, Loader2 } from "lucide-react";
import type { Task, TaskStatus } from "@/types";
import {
  calculateUrgency,
  getDaysRemaining,
  getUrgencyBadgeClasses,
  getPriorityClasses,
  getTypeClasses,
  getUrgencyLabel,
} from "@/lib/task-utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<{ error: string | null }>;
  onUpdateStatus: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<{ error: string | null }>;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onUpdateStatus,
}: TaskCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const urgency = calculateUrgency(task.due_date, task.status);
  const daysRemaining = getDaysRemaining(task.due_date);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
    setIsDeleting(false);
    setShowDeleteDialog(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    await onUpdateStatus(task.id, newStatus as TaskStatus);
    setIsUpdatingStatus(false);
  };

  return (
    <div className="bg-[#faf5ee] rounded-2xl p-4 sm:p-5 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] hover:shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff] transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-2">
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs font-medium ${getTypeClasses(task.type)}`}
            >
              {task.type === "assignment" ? "📝 Assignment" : "🧪 Class Test"}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs font-medium ${getPriorityClasses(task.priority)}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] sm:text-xs font-medium ${getUrgencyBadgeClasses(urgency)}`}
            >
              {getUrgencyLabel(urgency)}
            </Badge>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-[#3d3429] truncate">
            {task.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#8b7355] mt-1">{task.subject}</p>

          {task.description && (
            <p className="text-xs sm:text-sm text-[#6b5b47] mt-2 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-[#8b7355]">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {new Date(task.due_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span>
                {daysRemaining === 0
                  ? "Due today"
                  : daysRemaining < 0
                    ? `${Math.abs(daysRemaining)} days overdue`
                    : `${daysRemaining} days left`}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex flex-col gap-2 items-end">
          <div className="flex items-center gap-2">
            {isUpdatingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin text-[#8b7355]" />
            ) : (
              <Select
                value={task.status}
                onValueChange={handleStatusChange}
                disabled={isUpdatingStatus}
              >
                <SelectTrigger className="w-[130px] h-8 text-xs bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2]"
              onClick={() => onEdit(task)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile action row — below content, full width */}
      <div className="flex sm:hidden items-center gap-2 mt-3 pt-3 border-t border-[#e8dfd2]">
        {isUpdatingStatus ? (
          <Loader2 className="h-4 w-4 animate-spin text-[#8b7355]" />
        ) : (
          <Select
            value={task.status}
            onValueChange={handleStatusChange}
            disabled={isUpdatingStatus}
          >
            <SelectTrigger className="flex-1 h-9 text-xs bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
              <SelectItem value="not_started">Not Started</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2]"
          onClick={() => onEdit(task)}
        >
          <Pencil className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#faf5ee] border-[#e8dfd2] shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#3d3429]">
              Delete Task
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8b7355]">
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isDeleting}
              className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
