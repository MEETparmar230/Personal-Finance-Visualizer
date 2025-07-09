'use client'

import { useEffect, useState } from 'react'
import { PieChart as RePieChart, Pie, Tooltip } from 'recharts'

type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function PieChart() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data)
    }
    fetchData()
  }, [])

  // Filter transactions based on selected month & year
  const filteredTransactions = transactions.filter((t) => {
    const d = new Date(t.date)
    return d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
  })

  const categoryData = filteredTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount
    return acc
  }, {} as Record<string, number>)

  const pieChartData = Object.entries(categoryData).map(([category, amount]) => ({
    category,
    amount
  }))

  return (
    <div className='max-w-2xl bg-gray-100 p-4 rounded-md my-8 mx-auto'>
      <h2 className="text-xl font-semibold mb-4">Compare Transactions</h2>
    <div className="flex flex-col items-center gap-4 my-8 ">
    
      <div className="flex gap-4">
        {/* Month Select */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {monthNames.map((name, index) => (
            <option key={index + 1} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        {/* Year Select */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border rounded px-2 py-1"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const year = new Date().getFullYear() - i
            return (
              <option key={year} value={year}>
                {year}
              </option>
            )
          })}
        </select>
      </div>

      {/* Pie Chart */}
      {pieChartData.length > 0 ? (
        <RePieChart width={300} height={300}>
          <Pie
            data={pieChartData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          />
          <Tooltip />
        </RePieChart>
      ) : (
        <p className="text-gray-500 italic">No data for selected month and year.</p>
      )}
    </div>
    </div>
  )
}
