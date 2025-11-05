'use client'


import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAlert } from '@/context/AlertContext'
import { DatePicker } from './DatePicker'


type Props = {
  onSuccess: () => Promise<void>
}
type ErrorType = {
  amount?: string
  date?: string
  description?: string
  category?: string
}

export default function TransactionForm({ onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorType>({})
  const { setAlert, setAlertType } = useAlert()

  const checkEmpty = (): boolean => {
    const newErrors: ErrorType = {}
    if (amount.trim() === '') { newErrors.amount = "Amount is Required" }
    if (date.trim() === '') { newErrors.date = "Date is Required" }
    if (description.trim() === '') { newErrors.description = "Description is Required" }
    if (category.trim() === '') { newErrors.category = "required" }
    setError(newErrors)
    return (Object.keys(newErrors).length === 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError({})
    if (!checkEmpty()) {
      return
    }
    setLoading(true)
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: Number(amount), date, description, category, }),
    })

    if (res.ok) {
      setAmount('')
      setDate('')
      setDescription('')
      setCategory('')
      setAlert('Transaction added!')
      setAlertType("success")
      await onSuccess()
    } else {
      setAlert('Something went wrong')
      setAlertType('error')
    }

    setLoading(false)
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-md mx-auto mt-6 bg-card border border-border">
      <div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded "
        />
        {error && <p className='text-red-400 text-sm font-light '>{error.amount}</p>}
      </div>
      <div>
        <div className="h-10 border hover:border-2 border-gray-200 hover:border-gray-300  rounded-md py-1">
        <DatePicker
          value={date}
          onChange={(newValue) => setDate(newValue)}
        />
        </div>
        {error && <p className='text-red-400 text-sm font-light'>{error.date}</p>}
      </div>
      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
        {error && <p className='text-red-400 text-sm font-light'>{error.description}</p>}
      </div>
      <div>
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-[180px] ">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Category</SelectLabel>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Bills">Bills</SelectItem>
              <SelectItem value="Shopping">Shopping</SelectItem>
              <SelectItem value="Entertainment">Entertainment</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {error && <p className='text-red-400 text-sm font-light'>{error.category}</p>}
      </div>
      <button type="submit" disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded">
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  )
}
