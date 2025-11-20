'use client'

import { useAlert } from '@/context/AlertContext'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { DatePicker } from './DatePicker'

type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
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
  loading: true | false;
};

const UPDATE_TRANSACTION = `
  mutation UpdateTransaction(
    $_id: ID!,
    $amount: Float!,
    $date: Date!,
    $description: String!,
    $category: String!
  ) {
    updateTransaction(
      _id: $_id,
      amount: $amount,
      date: $date,
      description: $description,
      category: $category
    ) {
      success
      message
      data {
        _id
        amount
        date
        description
        category
      }
    }
  }
`;

const DELETE_TRANSACTION = `
  mutation DeleteTransaction($_id: ID!) {
    deleteTransaction(_id: $_id) {
      success
      message
    }
  }
`;



export default function TransactionList({ transactions, onSuccess, loading }: Props) {
  const pathname = usePathname();
  const hideControls = pathname === '/dashboard'
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    amount: '',
    date: '',
    description: '',
    category: ''
  })
  const [selectedCategory, setSelectedCategory] = useState("All")
  const { setAlert, setAlertType } = useAlert()
  const [editLoading, setEditLoading] = useState(false)
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null)
  const [saveLoading, setSaveLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)

  const [error, setError] = useState<ErrorType>({})

  const checkEmpty = (): boolean => {
    const newErrors: ErrorType = {}
    if (editForm.amount.trim() === '' || Number(editForm.amount) === 0) { newErrors.amount = "Required" }
    if (editForm.date.trim() === '') { newErrors.date = "Required" }
    if (editForm.description.trim() === '') { newErrors.description = "Required" }
    if (editForm.category.trim() === '') { newErrors.category = "Required" }
    setError(newErrors)
    return (Object.keys(newErrors).length === 0)
  }

  const filteredTransactions: Transaction[] = selectedCategory === "All"
    ? transactions
    : transactions.filter((t) =>
      (t.category ?? '').trim().toLowerCase() === selectedCategory.toLowerCase()
    )




  const handleDelete = async (id: string) => {
    setDeleteLoadingId(id)
    const res = await fetch("/api/graphql", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: DELETE_TRANSACTION,
    variables: { _id: id },
  }),
});

const json = await res.json();

if (json.data.deleteTransaction.success) {
  onSuccess?.();
  setAlert("Transaction Deleted!");
  setAlertType("success");
} else {
  setAlert(json.data.deleteTransaction.message);
  setAlertType("error");
}

    setDeleteLoadingId(null)
  }

 const handleEditClick = (t: Transaction) => {
  setEditLoading(true)
  setEditingId(t._id)
  setEditForm({
    amount: t.amount.toString(),
    date: new Date(t.date).toISOString().split('T')[0],
    description: t.description,
    category: t.category,
  })
  setEditLoading(false)
}

const handleUpdate = async (id: string) => {
  setSaveLoading(true)
  setError({})
  
  if (!checkEmpty()) { 
    setSaveLoading(false);
    return;
  }

  try {
    const dateObj = new Date(editForm.date);
    
    // Validate date
    if (isNaN(dateObj.getTime())) {
      setAlert("Invalid date format");
      setAlertType("error");
      setSaveLoading(false);
      return;
    }

    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: UPDATE_TRANSACTION,
        variables: {
          _id: id,
          amount: Number(editForm.amount),
          date: dateObj.toISOString(),
          description: editForm.description,
          category: editForm.category,
        },
      }),
    });

    const json = await res.json();

    // Check for GraphQL errors
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      setAlert(json.errors[0].message);
      setAlertType("error");
    } else if (json.data?.updateTransaction?.success) {
      setEditingId(null);
      await onSuccess?.();
      setAlert("Transaction Updated!");
      setAlertType("success");
    } else {
      setAlert(json.data?.updateTransaction?.message || "Update failed");
      setAlertType("error");
    }
  } catch (error) {
    console.error('Update error:', error);
    setAlert("Network error occurred");
    setAlertType("error");
  }
  
  setSaveLoading(false);
}


  return (


    <div className="max-w-md mx-auto mt-8 bg-background p-4 rounded-md border border-border">
      <h2 className="text-xl font-semibold mb-4 text-foreground">Transactions</h2>
      {loading ? <div className="space-y-2 animate-pulse">
        <div className="flex justify-between gap-2">
          <div className="h-8 bg-gray-300 rounded w-24" />
          <div className="h-8 bg-gray-300 rounded w-32" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <div className="h-8 bg-gray-300 rounded w-full" />
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-300 rounded w-24" />
            <div className="flex gap-2">
              <div className="h-6 bg-blue-300 rounded w-14" />
              <div className="h-6 bg-red-300 rounded w-16" />
            </div>
          </div>
        </div>
      </div>

        : <div>
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
              <p className="text-card-foreground italic  px-2">No transactions in this category.</p>
            ) : (
              filteredTransactions.map((t) => (
                <li key={t._id} className="p-3 border border-border rounded shadow-sm bg-card text-card-foreground">
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
                          {error.amount && <p className='text-red-400 text-sm font-light'>{error.amount}</p>}
                        </div>
                        <div >
                         <div className='w-35 border rounded-md'>
  <DatePicker
    value={editForm.date}
    onChange={(newValue) => {
     
      const formattedDate = new Date(newValue).toISOString().split('T')[0];
      setEditForm({ ...editForm, date: formattedDate });
    }}
  />
</div>
                          {error.date && <p className='text-red-400 text-sm font-light'>{error.date}</p>}
                        </div>
                      </div>
                      <div className=' grid grid-cols-1 gap-2'>

                        <div className=''>
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="rounded-md border border-border px-2 w-80"
                          />
                          {error && <p className='text-red-400 text-sm font-light'>{error.description}</p>}
                        </div>
                        <div className='flex justify-between'>
                          <div className="text-xs text-card-foreground italic items-center flex px-1 px-1 flex items-center px-1 ">{t.category}</div>

                          <div className="flex gap-2 items-end justify-center">
                            <button onClick={() => handleUpdate(t._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-0 h-6 w-14 rounded block">
                              {saveLoading ?
                                <div className="flex justify-center items-center">
                                  <div className="w-4 h-4 border-3  border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                                :
                                "Save"}
                            </button>
                            <button onClick={() => { setCancelLoading(true); setEditingId(null); setError({}); setCancelLoading(false) }} className="text-white bg-gray-500 hover:bg-gray-600 h-6 w-16 px-2 py-0 rounded">
                              {cancelLoading ?
                                <div className="flex justify-center items-center">
                                  <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                                :
                                "Cancel"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='grid grid-cols-1 gap-1'>
                      <div className="flex justify-between">
                        <span className=' rounded-md'>₹{t.amount}</span>
                        <span className='border border-border px-1 rounded-md'>{new Date(t.date).toLocaleDateString()}</span>
                      </div>

                      <div className="text-sm text-card-foreground w-full border border-border px-1 rounded-md">{t.description}</div>
                      <div className='flex justify-between'>
                        <div className="text-sm text-muted-foreground bg-blue flex justify-center items-center mx-1  px-1">{t.category}</div>
                        {!hideControls && <div className="flex gap-2 items-end">
                          <button onClick={() => handleEditClick(t)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0 rounded  h-6 w-14 ">
                            {editLoading ?
                              <div className="flex justify-center items-center ">
                                <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                              :
                              "Edit"}
                          </button>
                          <button onClick={() => handleDelete(t._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 h-6 w-16 py-0 rounded">
                            {deleteLoadingId === t._id ?
                              <div className="flex justify-center items-center ">
                                <div className="w-4 h-4 border-3 border-white border-t-transparent rounded-full animate-spin" />
                              </div>
                              :
                              "Delete"}
                          </button>
                        </div>}
                      </div>

                    </div>
                  )}
                </li>
              ))
            )}
          </ul>

        </div>}
    </div>
  )
}
