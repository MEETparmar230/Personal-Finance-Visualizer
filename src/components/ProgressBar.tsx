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
  loading:true|false;
};

export default function ProgressBar({ transactions, budgets, loading }: Props) {

const groupedBudgets = useMemo(() => {
    const grouped: Record<string, Budget[]> = {};
    budgets.forEach(b => {
      if (!grouped[b.category]) grouped[b.category] = [];
      grouped[b.category].push(b);
    });
    return grouped;
  }, [budgets]);

  if (loading) {
  // Show loader even if budgets are empty
  return (
    <div className="w-full mt-8 bg-gray-100 rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-6 text-center mt-6 animate-pulse bg-gray-300 h-6 w-48 mx-auto rounded" />
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4">
        {[...Array(3)].map((_, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded shadow animate-pulse space-y-3"
          >
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto" />
            <div className="h-48 bg-gray-200 rounded" />
            <div className="flex justify-between mt-4">
              <div className="h-4 w-16 bg-gray-300 rounded" />
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  if (budgets.length === 0) return null;
  

return (
  <div>
    
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
    </div>
  );
  
}

