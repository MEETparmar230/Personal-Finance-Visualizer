'use client'
import React, { useEffect, useState } from 'react'
import ChartBar from '@/components/ChartBar'
import PieChart from '@/components/PieChart'
import SummaryCards from '@/components/SummaryCards'
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

  useEffect(() => {
    const load = async () => {
      const txns = await fetchTransactions()
      setTransactions(txns)
    }
    load()
  }, [])

  return (
    <div className='p-4'>
      <ChartBar transactions={transactions} />
      <PieChart/>
      <TransactionList transactions={transactions}/>

    </div>
  )
}
