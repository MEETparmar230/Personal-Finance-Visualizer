'use client'

import { useAlert } from '@/context/AlertContext'
import { useEffect, useState } from 'react'

type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category:string
}

type ErrorType = {
  amount?: string
  date?: string
  description?: string
  category?: string
}
type Props = {
  transactions: Transaction[];
  onSuccess?: () => void; 
};

export default function TransactionList({ transactions, onSuccess }: Props) {

  const [editingId, setEditingId] = useState<string | null>(null)
const [editForm, setEditForm] = useState({
  amount: '',
  date: '',
  description: '',
  category:''
})
const [selectedCategory, setSelectedCategory] = useState("All")
const { setAlert, setAlertType } = useAlert()


 const [error,setError]= useState<ErrorType>({})

  const checkEmpty = ():boolean =>{
    const newErrors:ErrorType = {}
      if(editForm.amount.trim() === '' || Number(editForm.amount) === 0){newErrors.amount="Required"}
      if(editForm.date.trim() === ''){newErrors.date="Required"}
      if(editForm.description.trim()===''){newErrors.description="Required"}
      if(editForm.category.trim()===''){newErrors.category="Required"}
      setError(newErrors)
      return (Object.keys(newErrors).length === 0)
  }
  const filteredTransactions: Transaction[] = selectedCategory === "All"
  ? transactions
  : transactions.filter((t) =>
      (t.category ?? '').trim().toLowerCase() === selectedCategory.toLowerCase()
    )



  
  const handleDelete = async (id:String) =>{
    const res = await fetch(`/api/transactions/${id}`,{
      method:'DELETE'
    })

    if(res.ok){
      onSuccess?.();
      setAlert('Transaction Deleted!')
      setAlertType('success')
    }
    else{
     setAlert('Failed to delete'),
     setAlertType("error")
    }
}

const handleEditClick = (t: Transaction) => {
  setEditingId(t._id)
  setEditForm({
    amount: t.amount.toString(),
    date: t.date.slice(0, 10),
    description: t.description,
    category:t.category,
  })
}

const handleUpdate = async (id: string) => {
  setError({})
  if(!checkEmpty()) return;
  const res = await fetch(`/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: Number(editForm.amount),
      date: editForm.date,
      description: editForm.description,
      category:editForm.category
    }),
  })

  if (res.ok) {
    setEditingId(null)
    await onSuccess?.()
    setAlert("Transaction Updated!")
    setAlertType("success")
  } else {
    setAlert('Update failed')
    setAlertType("error")
  }
}


  return (
    <div className="max-w-md mx-auto mt-8 bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
       <select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
  className="mb-4 border px-2 py-1 rounded "
>
  <option value="All">All</option>
  <option value="Food">Food</option>
  <option value="Bills">Bills</option>
  <option value="Transport">Transport</option>
  <option value="Health">Health</option>
  <option value="Shopping">Shopping</option>
  <option value="Entertainment">Entertainment</option>
  <option value="Other">Other</option>
</select>
      <ul className="space-y-2  rounded">
  {filteredTransactions.length === 0 ? (
    <p className="text-gray-500 italic  px-2">No transactions in this category.</p>
  ) : (
    filteredTransactions.map((t) => (
      <li key={t._id} className="p-3 border rounded shadow-sm bg-white">
        {editingId === t._id ? (
          <div className="space-y-2">
            <div className='flex justify-between'>
              <div>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="rounded-md border px-2 max-w-26 w-auto "
                />
                {error && <p className='text-red-400 text-sm font-light'>{error.amount}</p>}
              </div>
              <div>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="rounded-md border w-32 ps-2 "
                />
                {error && <p className='text-red-400 text-sm font-light'>{error.date}</p>}
              </div>
            </div>
            <div className='flex justify-between'>
              <div>
                <input
                  type="text"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="rounded-md border px-2"
                />
                {error && <p className='text-red-400 text-sm font-light'>{error.description}</p>}
              </div>
              <div className="text-xs text-gray-500 italic items-center flex px-1">{t.category}</div>
              <div className="flex gap-2 items-end">
                <button onClick={() => handleUpdate(t._id)} className="bg-green-500 text-white px-2 py-0 rounded">
                  Save
                </button>
                <button onClick={() => { setEditingId(null); setError({}) }} className="bg-gray-400 px-2 py-0 rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between">
              <span>₹{t.amount}</span>
              <span>{new Date(t.date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between mt-1">
              <div className="text-sm text-gray-600">{t.description}</div>
              <div className="text-sm text-gray-600 bg-blue">{t.category}</div>
              <div className="flex gap-2 items-end">
                <button onClick={() => handleEditClick(t)} className="bg-blue-600 text-white px-2 py-0 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(t._id)} className="bg-red-600 text-white px-2 py-0 rounded">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </li>
    ))
  )}
</ul>

    </div>
  )
}
