'use client';

import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {CategoryChart} from '@/components/CategoryChart'

type Transaction = {
  _id: string;
  amount: number;
  date: string;
  category: string;
};

type Budget = {
  _id: string;
  amount: number;
  category: string;
  month: string;
  year: string;  
};

type Props = {
  transactions: Transaction[];
  budgets: Budget[];
};

export default function ProgressBar({ transactions, budgets }: Props) {
  // const chartData = useMemo(() => {
  //   const spending: Record<string, number> = {};

  //   transactions.forEach(t => {
  //     const month = (new Date(t.date).getMonth() + 1).toString();
  //     const year = new Date(t.date).getFullYear().toString();
  //     const key = `${t.category}-${month}-${year}`;
  //     spending[key] = (spending[key] || 0) + t.amount;
  //   });

  //   return budgets.map(b => {
  //     const key = `${b.category}-${b.month}-${b.year}`;
  //     const spent = spending[key] || 0;

  //     return {
  //       name: `${b.category} (${new Date(0, Number(b.month) - 1).toLocaleString('default', { month: 'short' })} ${b.year})`,
  //       budget: b.amount,
  //       spent,
  //     };
  //   });
  // }, [budgets, transactions]);

  // if (chartData.length === 0) return null;
const groupedBudgets = useMemo(() => {
    const grouped: Record<string, Budget[]> = {};
    budgets.forEach(b => {
      if (!grouped[b.category]) grouped[b.category] = [];
      grouped[b.category].push(b);
    });
    return grouped;
  }, [budgets]);

  if (budgets.length === 0) return null;
  

//   return (
//     <div className="mt-8 w-full overflow-x-auto">
//       <h2 className="text-xl font-semibold mb-4 text-center">Spent vs Budget</h2>
//       <ResponsiveContainer width="100%" height={300}>
//   <BarChart
//     data={chartData}
//     margin={{ top: 10, right: 20, left: 0, bottom: 80 }} // allow room for rotated labels + legend
//   >
//     <XAxis 
//       dataKey="name"
//       angle={-30}
//       textAnchor="end"
//       interval={0}
//     />
//     <YAxis />
//     <Tooltip />
//     <Legend 
//       verticalAlign="bottom"
//       height={36}
//     />
//     <Bar dataKey="budget" fill="#82ca9d" />
//     <Bar dataKey="spent" fill="#8884d8" />
//   </BarChart>
// </ResponsiveContainer>

//     </div>
//   );}

return (
    <div className="w-full mt-8 bg-gray-100 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-6 text-center mt-6">Spent vs Budget</h2>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1'>
      {Object.entries(groupedBudgets).map(([category, catBudgets]) => (
       
       <CategoryChart
          key={category}
          category={category}
          budgets={catBudgets}
          transactions={transactions}
        />
       
      ))}
      </div>
    </div>
  );
}

