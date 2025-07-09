'use client';

import { useMemo } from 'react';
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

const groupedBudgets = useMemo(() => {
    const grouped: Record<string, Budget[]> = {};
    budgets.forEach(b => {
      if (!grouped[b.category]) grouped[b.category] = [];
      grouped[b.category].push(b);
    });
    return grouped;
  }, [budgets]);

  if (budgets.length === 0) return null;
  

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

