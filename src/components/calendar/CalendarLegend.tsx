import { Tag, Calendar, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getPriorityClasses, getTypeClasses } from "@/lib/task-utils";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-4 text-xs text-[#5a4d3e]">
      <div className="flex items-center gap-2">
        <span className="font-medium">Priority:</span>
        <Badge variant="outline" className={`text-[10px] font-medium ${getPriorityClasses("High")}`}>
          <Tag className="h-3 w-3 mr-1" />
          High
        </Badge>
        <Badge variant="outline" className={`text-[10px] font-medium ${getPriorityClasses("Medium")}`}>
          <Tag className="h-3 w-3 mr-1" />
          Medium
        </Badge>
        <Badge variant="outline" className={`text-[10px] font-medium ${getPriorityClasses("Low")}`}>
          <Tag className="h-3 w-3 mr-1" />
          Low
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-medium">Type:</span>
        <Badge variant="outline" className={`text-[10px] font-medium ${getTypeClasses("Assignment")}`}>
          <Calendar className="h-3 w-3 mr-1" />
          Assignment
        </Badge>
        <Badge variant="outline" className={`text-[10px] font-medium ${getTypeClasses("Class Test")}`}>
          <FlaskConical className="h-3 w-3 mr-1" />
          Class Test
        </Badge>
      </div>
    </div>
  );
}
