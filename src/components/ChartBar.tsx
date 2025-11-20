'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'

type Transaction = {
  amount: number
  date: string
  description: string
}
type Props = {
  transactions: Transaction[]
  tLoading:true|false
}

export default function ChartBar({ transactions , tLoading}: Props) {
  const chartData = transactions.reduce((acc: Record<string, number>, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + t.amount
    return acc
  }, {})

  const formatted = Object.entries(chartData).map(([month, amount]) => ({ month, amount }))
  const chartWidth = Math.max(formatted.length * 100, 300) 

  return (
    <div>

    {
      tLoading?
      <div className="max-w-2xl mx-auto mt-8 bg-card p-4 rounded-md overflow-x-auto animate-pulse border border-border">
      {/* Title */}
      <div className="h-6 w-48 bg-gray-300 rounded mb-8" />

      {/* Bar Chart Skeleton */}
      <div className="min-w-fit flex items-center justify-center">
        <div className="md:w-[600px] md:h-[300px] lg:w-[600px] lg:h-[300px]  w-50 h-60 mb-14 bg-gray-300 rounded-md" />
      </div>
    </div>
    :
      <div className="max-w-2xl mx-auto mt-8 bg-card shadow p-4 rounded-md overflow-x-auto border border-border">
      <h2 className="text-xl font-semibold mb-8">Monthly Expenses</h2>
      <div className="min-w-fit flex items-center justify-center">
        <BarChart
          width={chartWidth}
          height={300}
          data={formatted}
          margin={{ top: 10, right: 20, left: 0, bottom: 50 }}
        >
          <XAxis
            dataKey="month"
            angle={-40}
            textAnchor="end"
            interval={0}
            height={60}
            
          />
          <YAxis width={80}/>
          <Tooltip />
          <Bar dataKey="amount" fill="#5ea500" />
        </BarChart>
      </div>
    </div>}
    </div>
  )
}
