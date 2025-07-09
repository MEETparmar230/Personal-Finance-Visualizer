'use client'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import  { useEffect, useState } from 'react'



type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category:string
}

export default function Home() {

  const [transactions,setTransactions] = useState<Transaction[]>([])
  const fetchData = async () => {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data);
  }

  useEffect(() => {
    fetchData()
  }, [])

  const chartData = transactions.reduce((acc: Record<string, number>, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + t.amount
    return acc
  }, {})

    const formattedChartData = Object.entries(chartData).map(([month, amount]) => ({ month, amount }))

  return (
    <main className="p-4 ">
      <TransactionForm onSuccess={fetchData} />
      <TransactionList transactions={transactions} onSuccess={fetchData}/>
    </main>
  )
}
