'use client'
import React, { useEffect, useState } from 'react'
import ChartBar from '@/components/ChartBar'
import PieChart from '@/components/PieChart'
import { fetchTransactions } from '@/lib/api'
import TransactionList from '@/components/TransactionList'


type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}

export default function Page() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
   const [loading,setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const txns = await fetchTransactions()
      setTransactions(txns)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className='p-4'>
      <ChartBar transactions={transactions} tLoading={loading}/>
      <PieChart/>
      <TransactionList transactions={transactions} loading={loading}/>

    </div>
  )
}
