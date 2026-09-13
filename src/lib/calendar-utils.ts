import type { EventType } from "@/types/events";
import type { TaskPriority } from "@/types";

export function getEventTypeLabel(eventType: EventType): string {
  return eventType;
}

export function getEventTypeColor(eventType: EventType): string {
  switch (eventType) {
    case "Hackathon":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Workshop":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Seminar":
      return "bg-cyan-100 text-cyan-700 border-cyan-200";
    case "Competition":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Club Event":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "College Event":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "Exam Deadline":
      return "bg-red-100 text-red-700 border-red-200";
    case "Registration Deadline":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Scholarship Deadline":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Project Deadline":
      return "bg-orange-100 text-orange-700 border-orange-200";
    case "Internship Deadline":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Other":
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function getPriorityColor(priority: TaskPriority): string {
  switch (priority) {
    case "High":
      return "bg-rose-100 text-rose-700 border-rose-200";
    case "Medium":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Low":
    default:
      return "bg-sky-100 text-sky-700 border-sky-200";
  }
}
