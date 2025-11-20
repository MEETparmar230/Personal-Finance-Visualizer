'use client'

import { useMemo } from "react"


type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}
interface Props {
  transactions:Transaction[],
  tLoading:boolean
}

export default function SummaryCards({ transactions , tLoading}: Props) {

const totalExpenses = useMemo(
  () => transactions.reduce((sum, t) => sum + t.amount, 0),
  [transactions]
);

const categoriesUsed = useMemo(
  () => new Set(transactions.map(t => t.category)).size,
  [transactions]
);

const mostRecent = useMemo(
  () =>
    [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )[0],
  [transactions]
);

  return (
    <div className="mt-2">
    {
      tLoading?
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6 animate-pulse">
      {[1, 2, 3].map((_, i) => (
        <div key={i} className="p-4 bg-card shadow rounded space-y-2">
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
          <div className={`h-6 ${i === 2 ? 'w-3/4' : 'w-1/2'} bg-gray-400 rounded`} />
          {i === 2 && (
            <>
              <div className="h-4 w-2/3 bg-gray-300 rounded" />
              <div className="h-3 w-1/2 bg-gray-200 rounded" />
            </>
          )}
        </div>
      ))}
    </div>
    :
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-card shadow rounded border border-border">
        <h4 className="text-card-foreground">Total Expenses</h4>
        <p className="text-xl font-bold">₹{totalExpenses}</p>
      </div>
      <div className="p-4 bg-card shadow rounded border border-border">
        <h4 className="text-card-foreground">Categories Used</h4>
        <p className="text-xl font-bold">{categoriesUsed}</p>
      </div>
      <div className="p-4 bg-card shadow rounded border border-border">
        <h4 className="text-card-foreground">Recent Transaction</h4>
        <p className="text-sm">{mostRecent?.description || '-'}</p>
        <p className="text-sm text-muted-foreground">
          {mostRecent?.date ? new Date(mostRecent.date).toLocaleDateString() : '-'}
        </p>
      </div>
    </div>}
    </div>
  )
}
