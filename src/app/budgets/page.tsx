"use client"

import React, { useEffect, useState } from 'react'
import BudgetForm from '@/components/budgetForm'
import BudgetList from '@/components/budgetList'

type Budget = {
  _id: string
  category: string
  amount: number
  month: string
  year: string
}

export default function Page() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading,setLoading] = useState(false)

  const fetchBudgets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/budgets')
      const data = await res.json()
      setBudgets(data)
    } catch (err) {
      console.error('Failed to fetch budgets', err)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleSuccess = async () => {
    await fetchBudgets()
  }

  return (
    
    <div className="max-w-3xl mx-auto mt-6 p-4">
      
      <BudgetForm onSuccess={handleSuccess} />
     
      <BudgetList budgets={budgets} onSuccess={handleSuccess} loading={loading} />
     
    </div>
   
  )
}
