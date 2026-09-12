import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function CalendarHeader({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousMonth}
          className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] h-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNextMonth}
          className="bg-[#f0e6d8] border-[#e0d5c5] text-[#5a4d3e] hover:bg-[#e8dfd2] h-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="bg-transparent text-[#8b7355] hover:text-[#5a4d3e] hover:bg-[#e8dfd2] h-9"
        >
          <CalendarIcon className="h-4 w-4 mr-1.5" />
          Today
        </Button>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-[#3d3429]">
        {currentMonth.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        })}
      </h2>
    </div>
  );
}
