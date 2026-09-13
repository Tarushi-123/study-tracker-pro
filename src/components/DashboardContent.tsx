import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock,
  FlaskConical,
  BookOpen,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import type { Task } from "@/types";
import {
  calculateTaskStats,
  calculateUrgency,
  getSubjectProgress,
  getUpcomingTasks,
  getDueTodayTasks,
  getOverdueTasks,
  getUpcomingTests,
  getDaysRemaining,
  getUrgencyBadgeClasses,
  getUrgencyLabel,
  getTypeClasses,
} from "@/lib/task-utils";

type DashboardTask = {
  id: string;
  title: string;
  subject: string;
  type: string;
  due_date: string;
  status: string;
};

interface DashboardContentProps {
  tasks: Task[];
}

export function DashboardContent({ tasks }: DashboardContentProps) {
  const stats = useMemo(() => calculateTaskStats(tasks), [tasks]);
  const subjectProgress = useMemo(() => getSubjectProgress(tasks), [tasks]);
  const dueTodayTasks = useMemo(() => getDueTodayTasks(tasks), [tasks]);
  const overdueTasks = useMemo(() => getOverdueTasks(tasks, 5), [tasks]);
  const upcomingTests = useMemo(() => getUpcomingTests(tasks, 4), [tasks]);
  const upcomingTasks = useMemo(() => getUpcomingTasks(tasks, 5), [tasks]);

  const completionPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning 👋";
    if (hour < 18) return "Good afternoon 👋";
    return "Good evening 👋";
  };

  const getGreetingSubtext = () => {
    if (stats.dueToday > 0)
      return `You have ${stats.dueToday} task${stats.dueToday > 1 ? "s" : ""} due today`;
    if (stats.overdue > 0)
      return `You have ${stats.overdue} overdue task${stats.overdue > 1 ? "s" : ""} — let's catch up`;
    if (stats.pending === 0 && stats.total > 0)
      return "All tasks completed — great work! 🎉";
    return "Here's your study schedule overview";
  };

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold text-[#3d3429]">{getGreeting()}</h1>
        <p className="text-[#8b7355] mt-1">{getGreetingSubtext()}</p>
      </div>

      {/* === ROW 1: URGENT ATTENTION — Due Today & Overdue === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Due Today */}
        <Card
          className={`border shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] ${
            dueTodayTasks.length > 0
              ? "bg-red-50 border-red-200"
              : "bg-[#faf5ee] border-[#e8dfd2]"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  dueTodayTasks.length > 0
                    ? "bg-red-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#fecaca]"
                    : "bg-emerald-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                }`}
              >
                {dueTodayTasks.length > 0 ? (
                  <CalendarClock className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
              </div>
              <span className="text-[#3d3429]">Due Today</span>
              {dueTodayTasks.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-auto text-xs bg-red-100 text-red-700 border-red-200"
                >
                  {dueTodayTasks.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dueTodayTasks.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-[#8b7355]">
                  Nothing due today — you're clear!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {dueTodayTasks.map((task) => (
                  <div
                    key={(task as DashboardTask).id}
                    className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-red-100 shadow-[inset_1px_1px_2px_#ffffff,inset_-1px_-1px_2px_#fecaca]"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-[#3d3429] truncate">
                          {(task as DashboardTask).title}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[10px] shrink-0 ${getTypeClasses((task as DashboardTask).type)}`}
                        >
                          {(task as DashboardTask).type === "Assignment" ? "📝" : "🧪"}{" "}
                          {(task as DashboardTask).type === "Assignment" ? "Assignment" : "Class Test"}
                        </Badge>
                      </div>
                      <p className="text-xs text-[#8b7355] mt-0.5">
                        {(task as DashboardTask).subject}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card
          className={`border shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff] ${
            overdueTasks.length > 0
              ? "bg-amber-50 border-amber-200"
              : "bg-[#faf5ee] border-[#e8dfd2]"
          }`}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  overdueTasks.length > 0
                    ? "bg-amber-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#fde68a]"
                    : "bg-emerald-100 shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                }`}
              >
                {overdueTasks.length > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
              </div>
              <span className="text-[#3d3429]">Overdue</span>
              {overdueTasks.length > 0 && (
                <Badge
                  variant="outline"
                  className="ml-auto text-xs bg-amber-100 text-amber-700 border-amber-200"
                >
                  {overdueTasks.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <div className="flex items-center gap-2 py-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <p className="text-sm text-[#8b7355]">
                  No overdue tasks — nice work!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {overdueTasks.map((task) => {
                  const daysOverdue = Math.abs(getDaysRemaining((task as DashboardTask).due_date));
                  return (
                    <div
                      key={(task as DashboardTask).id}
                      className="flex items-center justify-between p-3 bg-white/70 rounded-xl border border-amber-100 shadow-[inset_1px_1px_2px_#ffffff,inset_-1px_-1px_2px_#fde68a]"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#3d3429] truncate">
                            {(task as DashboardTask).title}
                          </p>
                          <Badge
                            variant="outline"
                            className="text-[10px] shrink-0 bg-gray-100 text-gray-700 border-gray-200"
                          >
                            ⚫ {daysOverdue}d overdue
                          </Badge>
                        </div>
                        <p className="text-xs text-[#8b7355] mt-0.5">
                          {(task as DashboardTask).subject}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === ROW 2: UPCOMING CLASS TESTS === */}
      <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-cyan-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
              <FlaskConical className="h-4 w-4 text-cyan-600" />
            </div>
            <span className="text-[#3d3429]">Upcoming Class Tests</span>
            {upcomingTests.length > 0 && (
              <Badge
                variant="outline"
                className="ml-auto text-xs bg-cyan-100 text-cyan-700 border-cyan-200"
              >
                {upcomingTests.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTests.length === 0 ? (
            <div className="flex items-center gap-2 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-sm text-[#8b7355]">
                No upcoming class tests on the horizon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {upcomingTests.map((task) => {
                const t = task as DashboardTask;
                const urgency = calculateUrgency(t.due_date, t.status);
                const daysLeft = getDaysRemaining(t.due_date);
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#3d3429] truncate">
                        {t.title}
                      </p>
                      <p className="text-xs text-[#8b7355]">
                        {t.subject} •{" "}
                        {new Date(t.due_date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ml-2 shrink-0 ${getUrgencyBadgeClasses(urgency)}`}
                    >
                      {daysLeft === 0
                        ? "Today"
                        : daysLeft === 1
                          ? "Tomorrow"
                          : `${daysLeft}d`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* === ROW 3: PROGRESS — Weekly + Subject-wise side by side === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Progress */}
        <Card className="lg:col-span-2 bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <TrendingUp className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-[#3d3429]">Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.total === 0 ? (
              <p className="text-sm text-[#8b7355]">
                No tasks to track yet. Add some tasks to see your progress!
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#6b5b47]">
                      <span className="font-bold text-[#3d3429]">
                        {stats.completed}
                      </span>{" "}
                      of{" "}
                      <span className="font-bold text-[#3d3429]">
                        {stats.total}
                      </span>{" "}
                      tasks completed
                    </span>
                    <span className="font-semibold text-[#8b7355]">
                      {completionPercentage}%
                    </span>
                  </div>
                  <div className="h-4 bg-[#e8dfd2] rounded-full overflow-hidden shadow-[inset_2px_2px_4px_#d4c9ba,inset_-2px_-2px_4px_#ffffff]">
                    <div
                      className="h-full bg-gradient-to-r from-[#8b7355] to-[#a69580] rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Summary row */}
                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div className="text-center p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                    <p className="text-xl font-bold text-[#3d3429]">
                      {stats.pending}
                    </p>
                    <p className="text-[10px] text-[#8b7355] uppercase tracking-wider">
                      Pending
                    </p>
                  </div>
                  <div className="text-center p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                    <p className="text-xl font-bold text-orange-600">
                      {stats.inProgress}
                    </p>
                    <p className="text-[10px] text-[#8b7355] uppercase tracking-wider">
                      In Progress
                    </p>
                  </div>
                  <div className="text-center p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                    <p className="text-xl font-bold text-emerald-600">
                      {stats.completed}
                    </p>
                    <p className="text-[10px] text-[#8b7355] uppercase tracking-wider">
                      Completed
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Progress */}
        <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-[#3d3429]">By Subject</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(subjectProgress).length === 0 ? (
              <p className="text-sm text-[#8b7355]">
                Add tasks to see subject-wise breakdown.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(subjectProgress)
                  .sort(
                    ([, a], [, b]) =>
                      a.completed / a.total - b.completed / b.total,
                  )
                  .map(([subject, progress]) => {
                    const pct =
                      progress.total > 0
                        ? Math.round(
                            (progress.completed / progress.total) * 100,
                          )
                        : 0;
                    return (
                      <div key={subject}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[#3d3429] text-xs">
                            {subject}
                          </span>
                          <span className="text-[10px] text-[#8b7355]">
                            {progress.completed}/{progress.total} • {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#e8dfd2] rounded-full overflow-hidden shadow-[inset_1px_1px_2px_#d4c9ba,inset_-1px_-1px_2px_#ffffff]">
                          <div
                            className="h-full bg-gradient-to-r from-[#8b7355] to-[#a69580] rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* === ROW 4: UPCOMING TASKS === */}
      <Card className="bg-[#faf5ee] border-[#e8dfd2] shadow-[6px_6px_12px_#d4c9ba,-6px_-6px_12px_#ffffff]">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <span className="text-[#3d3429]">📅 Up Next</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <div className="flex items-center gap-2 py-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <p className="text-sm text-[#8b7355]">
                No upcoming tasks. You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((task) => {
                const t = task as DashboardTask;
                const urgency = calculateUrgency(t.due_date, t.status);
                const daysLeft = getDaysRemaining(t.due_date);
                return (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-3 bg-[#f0e6d8] rounded-xl shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_#d4c9ba]"
                  >
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#3d3429] truncate">
                          {t.title}
                        </p>
                        <p className="text-xs text-[#8b7355]">
                          {t.subject} •{" "}
                          {new Date(t.due_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getTypeClasses(t.type)}`}
                      >
                        {t.type === "Assignment" ? "📝" : "🧪"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${getUrgencyBadgeClasses(urgency)}`}
                      >
                        {daysLeft === 0
                          ? "Today"
                          : daysLeft === 1
                            ? "Tomorrow"
                            : `${daysLeft}d left`}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
