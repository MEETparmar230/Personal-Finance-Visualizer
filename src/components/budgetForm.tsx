'use client'

import { useState } from 'react'
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem, SelectLabel
} from "@/components/ui/select"
import { useAlert } from '@/context/AlertContext';



type Props = {
  onSuccess: () => Promise<void>
}

type ErrorType = {
  category?: string
  amount?: string
  month?: string
  year?: string
}

export default function BudgetForm({ onSuccess }: Props) {
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorType>({})
  const { setAlert, setAlertType } = useAlert()



  const checkEmpty = (): boolean => {
    const newErrors: ErrorType = {}
    if (!category.trim()) newErrors.category = "Category is required"
    if (!amount.trim()) newErrors.amount = "Amount is required"
    if (!month.trim()) newErrors.month = "Month is required"
    if (!year.trim()) newErrors.year = "Year is required"

    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError({})
    if (!checkEmpty()) return

    setLoading(true)

    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, amount: Number(amount), month, year })
    })
    
    if (res.ok) {
      setCategory('')
      setAmount('')
      setMonth('')
      setYear('')
      await onSuccess()
      setAlert('Budget added!')
      setAlertType('success')
    }
   else if (res.status === 409) {
      setAlert('Budget already exists');
      setAlertType('error');
      
    }

    else {
      setAlert('Failed to add budget')
      setAlertType('error')
    }

    setLoading(false)
  }


  return (
    <div className=''>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-md mx-auto mt-6 bg-white">
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'].map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error.category && <p className="text-red-400 text-sm">{error.category}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
          {error.amount && <p className="text-red-400 text-sm">{error.amount}</p>}
        </div>

        <div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Month</SelectLabel>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error.month && <p className="text-red-400 text-sm">{error.month}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Year (e.g., 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
          {error.year && <p className="text-red-400 text-sm">{error.year}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Adding...' : 'Add Budget'}
        </button>
      </form>
    </div>
  )
}


