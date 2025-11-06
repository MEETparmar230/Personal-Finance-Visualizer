'use client'

import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem, SelectLabel
} from "@/components/ui/select"
import { useState } from 'react'
import { useAlert } from "@/context/AlertContext"

type Budget = {
  _id: string
  category: string
  amount: number
  month: string
  year: string
}

type Props = {
  budgets: Budget[]
  onSuccess: () => Promise<void>
  loading:true|false
}

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

export default function BudgetList({ budgets, onSuccess, loading }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    category: '',
    amount: '',
    month: '',
    year: ''
  })
  const { setAlert, setAlertType } = useAlert()
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string|null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  

  const handleEditClick = (b: Budget) => {
    setEditLoading(true)
    setEditingId(b._id)
    setEditForm({
      category: b.category,
      amount: b.amount.toString(),
      month: b.month,
      year: b.year
    })
    setEditLoading(false)
  }

  const handleUpdate = async (id: string) => {
      setSaveLoading(true)
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
    setSaveLoading(false)
  }

  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id)
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
    setDeleteLoadingId(null)
  }


  return (
  <div>
    
    <div className="max-w-md mx-auto mt-8 bg-background p-4 rounded-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Budgets</h2>
      {loading?
      <div>
        <ul className="space-y-2 rounded">
  {Array.from({ length: 3 }).map((_, i) => (
    <li key={i} className="p-3 border rounded shadow-sm bg-white animate-pulse">
      <div className="flex justify-between items-start">
        <div>
          <div className="h-4 w-24 bg-gray-300 rounded mb-2" />
          <div className="h-3 w-40 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-2 mt-1">
          <div className="h-6 w-14 bg-blue-200 rounded" />
          <div className="h-6 w-16 bg-red-200 rounded" />
        </div>
      </div>
    </li>
  ))}
</ul>

      </div>
      :
        <div>
          
      <ul className="space-y-2 rounded">
        {budgets.length === 0 ? (
          <p className="text-foreground italic">No budgets available.</p>
        ) : (
          budgets.map((b) => (
            <li key={b._id} className="p-3 border rounded shadow-sm bg-card">
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
                    <button onClick={() => handleUpdate(b._id)} className="text-white font-medium px-2 rounded bg-green-500 hover:bg-green-600 w-14 h-6">
                      {saveLoading ?
                          <div className="flex justify-center items-center ">
                            <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                          :
                          "Save"}
                    </button>
                    <button onClick={() => {setCancelLoading(true); setEditingId(null); setCancelLoading(false)}} className="text-white font-medium h-6 w-16 rounded bg-gray-500 hover:bg-gray-600">
                      {cancelLoading ?
                          <div className="flex justify-center items-center ">
                            <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                          :
                          "Cancel"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{b.category}</p>
                    <p className="text-sm text-muted-foreground">
                      ₹{b.amount} for {monthNames[Number(b.month) - 1]} {b.year}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => handleEditClick(b)} className="text-white h-6 w-14 bg-blue-500 hover:bg-blue-600 px-2 rounded">
                      {editLoading ?
                          <div className="flex justify-center items-center ">
                            <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                          :
                          "Edit"}
                    </button>
                    <button onClick={() => handleDelete(b._id)} className="text-white h-6 px-2 rounded w-16 bg-red-500 hover:bg-red-600 ">
                      {deleteLoadingId === b._id ?
                          <div className="flex justify-center items-center ">
                            <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                          :
                          "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))
        )}
      </ul>
      </div>}
    </div>
    
    </div>
    
  )
}
