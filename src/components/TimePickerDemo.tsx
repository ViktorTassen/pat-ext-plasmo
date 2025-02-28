import React, { useState } from "react"
import { TimePickerInput } from "~/components/ui/time-picker-input"
import { TimePicker, TimePickerWithPopover } from "~/components/ui/time-picker"
import { format } from "date-fns"

export const TimePickerDemo = () => {
  const [time, setTime] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  
  return (
    <div className="p-6 space-y-8 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Basic Time Picker Input</h2>
        <TimePickerInput 
          value={time}
          onTimeChange={setTime}
          className="w-full"
        />
        <p className="text-sm text-gray-500">Selected time: {time || "None"}</p>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Time Picker with Date Object</h2>
        <TimePicker 
          date={date}
          setDate={setDate}
        />
        <p className="text-sm text-gray-500">
          Selected time: {date ? format(date, "HH:mm:ss") : "None"}
        </p>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Time Picker with Popover</h2>
        <TimePickerWithPopover 
          date={date}
          setDate={setDate}
        />
        <p className="text-sm text-gray-500">
          Selected time: {date ? format(date, "HH:mm:ss") : "None"}
        </p>
      </div>
    </div>
  )
}