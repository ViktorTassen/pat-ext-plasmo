"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "~/lib/utils"

export interface TimePickerInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  picker?: boolean
  onTimeChange?: (time: string) => void
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  ({ className, onTimeChange, picker = true, ...props }, ref) => {
    const [time, setTime] = React.useState<string>(props.value as string || "")

    // Handle time change
    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTime(e.target.value)
      if (onTimeChange) {
        onTimeChange(e.target.value)
      }
    }

    return (
      <div className="relative">
        <input
          type="time"
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          value={time}
          onChange={handleTimeChange}
          {...props}
        />
        {picker && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            <Clock className="h-4 w-4" />
          </div>
        )}
      </div>
    )
  }
)

TimePickerInput.displayName = "TimePickerInput"

export { TimePickerInput }