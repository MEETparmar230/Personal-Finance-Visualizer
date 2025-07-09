'use client'

import { useEffect, useState } from 'react'
import { fetchTransactions, fetchBudgets } from '@/lib/api'

import SummaryCards from '@/components/SummaryCards'
import ChartBar from '@/components/ChartBar'
import PieChart from '@/components/PieChart'
import ProgressBar from '@/components/ProgressBar'

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
};

type Budget = {
  _id: string;
  category: string;
  amount: number;
  month: string;
  year: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    const load = async () => {
      const [txns, buds] = await Promise.all([fetchTransactions(), fetchBudgets()])
      setTransactions(txns)
      setBudgets(buds)
    }
    load()
  }, [])

  return (
    <main className="p-4 bg-gray-200">
      <SummaryCards />
      <ChartBar transactions={transactions} />
      <PieChart />
      <ProgressBar budgets={budgets} transactions={transactions} />
    </main>
  )
}
