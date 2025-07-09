'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Transaction = {
  amount: number
  date: string
  description: string
}
type Props = {
  transactions: Transaction[]
}

export default function ChartBar({ transactions }: Props) {
  const chartData = transactions.reduce((acc: Record<string, number>, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + t.amount
    return acc
  }, {})

  const formatted = Object.entries(chartData).map(([month, amount]) => ({ month, amount }))

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-gray-100 p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formatted} margin={{ top: 10, right: 20, left: 0, bottom: 50 }}>
          <XAxis 
  dataKey="month" 
  angle={-40} 
  textAnchor="end" 
  interval={0}
/>
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
