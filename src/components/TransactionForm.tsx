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

const mutation = `
  mutation addTransaction(
    $amount: Float!,
    $date: Date!,
    $description: String!,
    $category: String!
  ) {
    addTransaction(
      amount: $amount,
      date: $date,
      description: $description,
      category: $category
    ) {
      _id
      amount
      date
      description
      category
    }
  }
`

export default function TransactionForm({ onSuccess }: Props) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<ErrorType>({})

  const { setAlert, setAlertType } = useAlert()

  const checkEmpty = () => {
    const newErrors: ErrorType = {}
    if (!amount) newErrors.amount = "Amount is Required"
    if (!date) newErrors.date = "Date is Required"
    if (!description) newErrors.description = "Description is Required"
    if (!category) newErrors.category = "Category is Required"
    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!checkEmpty()) return

    setLoading(true)

    const [day, month, year] = date.split("/").map(Number)
    const isoDate = new Date(year,month-1,day).toISOString()

    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
  query: mutation,
  variables: {
    amount: Number(amount),
    date:isoDate,
    description,
    category,
  }
})


      })

      const json = await res.json()

      if (json.errors) {
        setAlert("Failed to add transaction")
        setAlertType("error")
      } else {
        setAlert("Transaction Added Successfully")
        setAlertType("success")

        // reset form
        setAmount('')
        setDate('')
        setDescription('')
        setCategory('')

        await onSuccess()
      }

    } catch (err) {
      setAlert("Something went wrong")
      setAlertType("error")
      console.log(err)
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md max-w-md mx-auto mt-6 bg-card">
      
      <div>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 w-full rounded"
        />
        {error.amount && <p className="text-red-400 text-sm">{error.amount}</p>}
      </div>

      <div>
        <div className="h-10 border rounded-md py-1">
          <DatePicker value={date} onChange={setDate} />
        </div>
        {error.date && <p className="text-red-400 text-sm">{error.date}</p>}
      </div>

      <div>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
        />
        {error.description && <p className="text-red-400 text-sm">{error.description}</p>}
      </div>

      <div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full">
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
        {error.category && <p className="text-red-400 text-sm">{error.category}</p>}
      </div>

      <button type="submit" disabled={loading} className="bg-primary text-white px-4 py-2 rounded">
        {loading ? 'Adding...' : 'Add Transaction'}
      </button>
    </form>
  )
}
