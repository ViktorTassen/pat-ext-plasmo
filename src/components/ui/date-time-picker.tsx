"use client"

import * as React from "react"
import { format } from "date-fns"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area"
import { CalendarIcon } from "lucide-react"

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerProps) {
  // Use local state to manage the date and UI state
  const [localDate, setLocalDate] = React.useState<Date | undefined>(date)
  const [showPicker, setShowPicker] = React.useState(false)
  const pickerRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Update local date when prop date changes
  React.useEffect(() => {
    setLocalDate(date)
  }, [date])

  // Handle clicks outside the picker to close it
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Generate hours and minutes arrays
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve the current time if there's an existing date
      if (localDate) {
        selectedDate.setHours(localDate.getHours())
        selectedDate.setMinutes(localDate.getMinutes())
      }
      setLocalDate(selectedDate)
      setDate(selectedDate)
    }
  }

  // Handle time change
  const handleTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (localDate) {
      const newDate = new Date(localDate)
      if (type === "hour") {
        newDate.setHours(parseInt(value))
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value))
      }
      setLocalDate(newDate)
      setDate(newDate)
    }
  }

  // Toggle picker visibility
  const togglePicker = () => {
    setShowPicker(!showPicker)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Date picker button */}
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          !localDate && "text-muted-foreground"
        )}
        onClick={togglePicker}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {localDate ? format(localDate, "MM/dd/yyyy HH:mm") : <span>MM/DD/YYYY HH:mm</span>}
      </Button>

      {/* Date and time picker dropdown */}
      {showPicker && (
        <div 
          ref={pickerRef}
          className="absolute z-50 mt-1 bg-popover text-popover-foreground rounded-md border shadow-md"
        >
          <div className="sm:flex">
            <Calendar
              mode="single"
              selected={localDate}
              onSelect={handleDateSelect}
              initialFocus
            />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={localDate && localDate.getHours() === hour ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("hour", hour.toString())}
                    >
                      {hour.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {minutes.map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={localDate && localDate.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
          <div className="p-3 border-t flex justify-end">
            <Button 
              size="sm" 
              onClick={() => setShowPicker(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}