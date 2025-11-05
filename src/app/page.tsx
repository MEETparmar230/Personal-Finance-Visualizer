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
  const [tLoading,setTLoading] = useState(false)
  const [bLoading,setBLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setTLoading(true)
      setBLoading(true)
      const [txns, buds] = await Promise.all([fetchTransactions(), fetchBudgets()])
      setTransactions(txns)
      setBudgets(buds)
      setTLoading(false)
      setBLoading(false)
    }
    load()
  }, [])

  return (
    <main className="p-4 bg-background">
      <SummaryCards />
      <ChartBar transactions={transactions} tLoading={tLoading}/>
      <PieChart />
      <ProgressBar budgets={budgets} transactions={transactions} loading={(bLoading&&tLoading)}/>
    </main>
  )
}
