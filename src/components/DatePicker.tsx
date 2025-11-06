'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) return ''
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

function isValidDate(date: Date | undefined) {
  return !!date && !isNaN(date.getTime())
}

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined
    const [day, month, year] = value.split('/').map(Number)
    const parsed = new Date(year, month - 1, day)
    return isValidDate(parsed) ? parsed : undefined
  })

  const [month, setMonth] = React.useState<Date | undefined>(date)

  return (
    <div className="relative flex gap-2 text-card-foreground">
      <Input
        id="date"
        value={value}
        placeholder="dd/mm/yyyy"
        className="bg-background pr-10 focus:outline-none focus:text-gray-900"
        onChange={(e) => {
          const parts = e.target.value.split('/')
          if (parts.length === 3) {
            const [day, month, year] = parts.map(Number)
            const parsedDate = new Date(year, month - 1, day)
            if (isValidDate(parsedDate)) {
              setDate(parsedDate)
              setMonth(parsedDate)
              onChange(formatDate(parsedDate))
            }
          }
          onChange(e.target.value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="absolute top-1/2 right-2 size-6 -translate-y-1/2">
            <CalendarIcon className="size-3.5" />
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="end" alignOffset={-8} sideOffset={10}>
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              setDate(date)
              if (date) {
                onChange(formatDate(date))
              }
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
