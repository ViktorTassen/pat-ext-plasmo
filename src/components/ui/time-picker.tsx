"use client"

import * as React from "react"
import { format, parse } from "date-fns"
import { Clock } from "lucide-react"

import { cn } from "~/lib/utils"
import { Button } from "./button"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { TimePickerInput } from "./time-picker-input"

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePicker({ date, setDate, className }: TimePickerProps) {
  const [selectedTime, setSelectedTime] = React.useState<string>(
    date ? format(date, "HH:mm") : ""
  )

  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)

  // Update the date when the time changes
  const updateTimeValue = (time: string) => {
    setSelectedTime(time)
    
    if (!time) {
      setDate(undefined)
      return
    }

    try {
      const [hours, minutes] = time.split(":")
      
      if (!date) {
        const newDate = new Date()
        newDate.setHours(parseInt(hours, 10))
        newDate.setMinutes(parseInt(minutes, 10))
        setDate(newDate)
      } else {
        const newDate = new Date(date)
        newDate.setHours(parseInt(hours, 10))
        newDate.setMinutes(parseInt(minutes, 10))
        setDate(newDate)
      }
    } catch (error) {
      console.error("Error parsing time:", error)
    }
  }

  // Update the selected time when the date changes
  React.useEffect(() => {
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  return (
    <div className={cn("flex items-end gap-2", className)}>
      <TimePickerInput
        value={selectedTime}
        onChange={(e) => updateTimeValue(e.target.value)}
        onTimeChange={updateTimeValue}
        className="w-full"
      />
    </div>
  )
}

interface TimePickerWithPopoverProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  className?: string
}

export function TimePickerWithPopover({
  date,
  setDate,
  className,
}: TimePickerWithPopoverProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {date ? format(date, "HH:mm") : "Select time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <TimePicker
          date={date}
          setDate={(newDate) => {
            setDate(newDate)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}