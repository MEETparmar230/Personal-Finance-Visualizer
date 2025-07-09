'use client'

import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem, SelectLabel
} from "@/components/ui/select"
import { useState } from 'react'
import { Alert, AlertTitle } from "./ui/alert"
import { useAlert } from "@/context/AlertContext"

type Budget = {
  _id: string
  category: string
  amount: number
  month: string // numeric month as string: "1" to "12"
  year: string
}

type Props = {
  budgets: Budget[]
  onSuccess: () => Promise<void>
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function BudgetList({ budgets, onSuccess }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    category: '',
    amount: '',
    month: '',
    year: ''
  })
  const { setAlert, setAlertType } = useAlert()
  

  const handleEditClick = (b: Budget) => {
    setEditingId(b._id)
    setEditForm({
      category: b.category,
      amount: b.amount.toString(),
      month: b.month,
      year: b.year
    })
  }

  const handleUpdate = async (id: string) => {

    const res = await fetch(`/api/budgets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editForm,
        amount: Number(editForm.amount),
      })
    })

    if (res.ok) {
      setEditingId(null)
      await onSuccess()
      setAlert("Budget Updated!")
      setAlertType("success")
    } else {
      setAlert("Update failed")
      setAlertType("error")
    }
  }

  const handleDelete = async (id: string) => {

    const res = await fetch(`/api/budgets/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      await onSuccess()
      setAlert("Budget Deleted!")
      setAlertType("success")
    } else {
      setAlert("Delete failed")
      setAlertType("error")
    }
  }


  return (
  <div>
    
    <div className="max-w-md mx-auto mt-8 bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Budgets</h2>
      <ul className="space-y-2 rounded">
        {budgets.length === 0 ? (
          <p className="text-gray-500 italic">No budgets available.</p>
        ) : (
          budgets.map((b) => (
            <li key={b._id} className="p-3 border rounded shadow-sm bg-white">
              {editingId === b._id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className="border p-2 w-full"
                  />
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={e => setEditForm({ ...editForm, amount: e.target.value })}
                    className="border p-2 w-full"
                  />
                  <Select
                    value={editForm.month}
                    onValueChange={(value) => setEditForm({ ...editForm, month: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Month</SelectLabel>
                        {monthNames.map((name, index) => (
                          <SelectItem key={index + 1} value={(index + 1).toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={e => setEditForm({ ...editForm, year: e.target.value })}
                    className="border p-2 w-full"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(b._id)} className="text-green-600 font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="text-gray-600 font-medium">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.category}</p>
                    <p className="text-sm text-gray-700">
                      ₹{b.amount} for {monthNames[Number(b.month) - 1]} {b.year}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleEditClick(b)} className="text-blue-600">Edit</button>
                    <button onClick={() => handleDelete(b._id)} className="text-red-600">Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
    </div>
  )
}
