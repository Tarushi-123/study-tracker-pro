import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X, Plus, Inbox } from "lucide-react";
import type { Task, TaskType, TaskStatus, TaskPriority } from "@/types";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => Promise<{ error: string | null }>;
  onUpdateStatus: (
    taskId: string,
    status: TaskStatus,
  ) => Promise<{ error: string | null }>;
  onAddTask: () => void;
}

export function TaskList({
  tasks,
  onEdit,
  onDelete,
  onUpdateStatus,
  onAddTask,
}: TaskListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        filterType === "all" || task.type === filterType;

      const matchesStatus =
        filterStatus === "all" || task.status === filterStatus;

      const matchesPriority =
        filterPriority === "all" || task.priority === filterPriority;

      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [tasks, searchQuery, filterType, filterStatus, filterPriority]);

  const hasActiveFilters =
    searchQuery !== "" ||
    filterType !== "all" ||
    filterStatus !== "all" ||
    filterPriority !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterStatus("all");
    setFilterPriority("all");
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-[#faf5ee] rounded-2xl p-4 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8b7355]" />
            <Input
              placeholder="Search by title or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-[#f0e6d8] border-[#e0d5c5] focus:border-[#8b7355] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 -mb-1">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[110px] sm:w-[120px] shrink-0 bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Class Test">Class Test</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[110px] sm:w-[130px] shrink-0 bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[110px] sm:w-[130px] shrink-0 bg-[#f0e6d8] border-[#e0d5c5] shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-[#faf5ee] border-[#e8dfd2]">
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="shrink-0 text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2]"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-[#faf5ee] rounded-2xl p-8 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] text-center">
            <Inbox className="h-12 w-12 text-[#c4b8a8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#5a4d3e] mb-2">
              No tasks yet
            </h3>
            <p className="text-sm text-[#8b7355] mb-4 max-w-sm mx-auto">
              Add your first assignment or class test to start tracking your
              study schedule.
            </p>
            <Button
              onClick={onAddTask}
              className="bg-[#8b7355] hover:bg-[#6b5b47] text-white shadow-[4px_4px_8px_#d4c9ba,-4px_-4px_8px_#ffffff]"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-[#faf5ee] rounded-2xl p-8 border border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] text-center">
            <Search className="h-12 w-12 text-[#c4b8a8] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#5a4d3e] mb-2">
              No matching tasks found
            </h3>
            <p className="text-sm text-[#8b7355] mb-4 max-w-sm mx-auto">
              Try adjusting your search or filters to find what you're looking
              for.
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2]"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onUpdateStatus={onUpdateStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
