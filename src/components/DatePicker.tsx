"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function parseDate(str: string): Date | null {
  const [day, month, year] = str.split('/').map(Number)
  const date = new Date(year, month - 1, day)
  return !isNaN(date.getTime()) ? date : null
}

type Props = {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: Props) {
  const parsed = parseDate(value)
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date | undefined>(parsed ?? new Date())

  return (
    <div className="relative flex gap-2 text-gray-500 w-full">
      <Input
        value={value}
        placeholder="dd/mm/yyyy"
        className="bg-background pr-10 focus:outline-none focus:ring-0 focus:border-gray-400"
        onChange={(e) => {
          const inputValue = e.target.value
          onChange(inputValue)
          const date = parseDate(inputValue)
          if (date) setMonth(date)
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={parsed ?? undefined}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(selectedDate) => {
              if (selectedDate) {
                onChange(formatDate(selectedDate))
                setMonth(selectedDate)
                setOpen(false)
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
