import { useState } from "react";
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
import { Loader2, Plus } from "lucide-react";
import type { TaskType, TaskPriority } from "@/types";

interface AddTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (task: {
    title: string;
    description: string;
    subject: string;
    type: TaskType;
    due_date: string;
    priority: TaskPriority;
  }) => Promise<{ error: string | null }>;
}

export function AddTaskForm({ open, onOpenChange, onSubmit }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [type, setType] = useState<TaskType>("Assignment");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("Medium");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setType("Assignment");
    setDueDate("");
    setPriority("Medium");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!subject.trim()) {
      setError("Subject is required");
      return;
    }
    if (!dueDate) {
      setError("Due date is required");
      return;
    }
    if (description.length > 500) {
      setError("Description must be under 500 characters");
      return;
    }

    setIsLoading(true);
    const result = await onSubmit({
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      type,
      due_date: dueDate,
      priority,
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
      <DialogContent className="sm:max-w-[500px] bg-[#faf5ee] border-[#e8dfd2] shadow-[8px_8px_16px_#d4c9ba,-8px_-8px_16px_#ffffff]">
        <DialogHeader>
          <DialogTitle className="text-xl text-[#4a3f35]">
            Add New Task
          </DialogTitle>
          <DialogDescription className="text-[#8b7355]">
            Add an assignment or class test to your schedule.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#5a4d3e]">
              Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-[#5a4d3e]">
              Subject *
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Java, DSA, Maths"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[#5a4d3e]">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description (max 500 chars)"
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff] min-h-[80px]"
              disabled={isLoading}
            />
            <p className="text-xs text-[#8b7355]">{description.length}/500</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[#5a4d3e]">Type *</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TaskType)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                  <SelectItem value="Assignment">Assignment</SelectItem>
                  <SelectItem value="Class Test">Class Test</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#5a4d3e]">Priority *</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-[#5a4d3e]">
              Due Date *
            </Label>
            <Input
              id="due_date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
              {error}
            </p>
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
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
