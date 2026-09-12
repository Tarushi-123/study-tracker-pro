import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  CalendarClock,
  TrendingUp,
} from "lucide-react";
import type { Task } from "@/types";
import {
  calculateTaskStats,
  calculateUrgency,
  getSubjectProgress,
  getUpcomingTasks,
  getRecentTasks,
  getUrgencyBadgeClasses,
  getUrgencyLabel,
  getTypeClasses,
} from "@/lib/task-utils";

interface DashboardContentProps {
  tasks: Task[];
}

export function DashboardContent({ tasks }: DashboardContentProps) {
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const subjectProgress = useMemo(() => getSubjectProgress(tasks), [tasks]);
  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks, 5), [tasks]);
  const recentTasks = useMemo(() => getRecentTasks(tasks, 5), [tasks]);

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-[#3d3429]">{getGreeting()}</h1>
        <p className="text-[#8b7355] mt-1">
          Here's your study schedule overview
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.total}
                </p>
                <p className="text-xs text-[#8b7355]">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.pending}
                </p>
                <p className="text-xs text-[#8b7355]">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.inProgress}
                </p>
                <p className="text-xs text-[#8b7355]">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.completed}
                </p>
                <p className="text-xs text-[#8b7355]">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-red-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <CalendarClock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.dueToday}
                </p>
                <p className="text-xs text-[#8b7355]">Due Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-cyan-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#3d3429]">
                  {stats.upcomingTests}
                </p>
                <p className="text-xs text-[#8b7355]">Upcoming Tests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#3d3429]">
            Weekly Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.total === 0 ? (
            <p className="text-sm text-[#8b7355]">
              No tasks to track yet. Add some tasks to see your progress!
            </p>
          ) : (
            <>
              <p className="text-sm text-[#6b5b47] mb-3">
                <span className="font-semibold">{stats.completed}</span> of{" "}
                <span className="font-semibold">{stats.total}</span> tasks
                completed
              </p>
              <div className="h-3 bg-[#e8dfd2] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                <div
                  className="h-full bg-gradient-to-r from-[#8b7355] to-[#a69580] rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-[#8b7355] mt-2">
                {completionPercentage}% complete
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subject Progress */}
      {Object.keys(subjectProgress).length > 0 && (
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#3d3429]">
              Subject Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(subjectProgress).map(([subject, progress]) => {
                const percentage =
                  progress.total > 0
                    ? Math.round((progress.completed / progress.total) * 100)
                    : 0;
                return (
                  <div key={subject}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-[#3d3429]">
                        {subject}
                      </span>
                      <span className="text-[#8b7355]">
                        {progress.completed}/{progress.total}
                      </span>
                    </div>
                    <div className="h-2 bg-[#e8dfd2] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_#d4c9ba,inset_-1px_-1px_2px_#ffffff]">
                      <div
                        className="h-full bg-gradient-to-r from-[#8b7355] to-[#a69580] rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Tasks & Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#3d3429]">
              📅 Up Next
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-[#8b7355]">
                No upcoming tasks. You're all caught up!
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const urgency = calculateUrgency(task.due_date, task.status);
                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#3d3429] truncate">
                          {task.title}
                        </p>
                        <p className="text-xs text-[#8b7355]">
                          {new Date(task.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-xs ml-2 ${getUrgencyBadgeClasses(urgency)}`}
                      >
                        {getUrgencyLabel(urgency)}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Tasks */}
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#3d3429]">
              🕐 Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <p className="text-sm text-[#8b7355]">
                No recent tasks. Start adding tasks to see them here!
              </p>
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#3d3429] truncate">
                        {task.title}
                      </p>
                      <p className="text-xs text-[#8b7355]">
                        {task.subject}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ml-2 ${getTypeClasses(task.type)}`}
                    >
                      {task.type === "assignment" ? "📝" : "🧪"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
