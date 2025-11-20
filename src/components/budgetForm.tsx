'use client';

import { useState } from 'react';
import {
  Select, SelectTrigger, SelectValue, SelectContent,
  SelectGroup, SelectItem, SelectLabel
} from '@/components/ui/select';
import { useAlert } from '@/context/AlertContext';
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/client/react';

export const ADD_BUDGET = gql`
  mutation AddBudget($category: String!, $amount: Float!, $month: String!, $year: String!) {
    addBudget(category: $category, amount: $amount, month: $month, year: $year) {
      _id
      category
      amount
      month
      year
    }
  }
`;


type Props = {
  onSuccess: () => Promise<void>;
};

type ErrorType = {
  category?: string;
  amount?: string;
  month?: string;
  year?: string;
};

export default function BudgetForm({ onSuccess }: Props) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [error, setError] = useState<ErrorType>({});
  const { setAlert, setAlertType } = useAlert();

  const [addBudget, { loading }] = useMutation(ADD_BUDGET);

  const checkEmpty = (): boolean => {
    const newErrors: ErrorType = {};
    if (!category.trim()) newErrors.category = 'Category is required';
    if (!amount.trim()) newErrors.amount = 'Amount is required';
    if (!month.trim()) newErrors.month = 'Month is required';
    if (!year.trim()) newErrors.year = 'Year is required';
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    if (!checkEmpty()) return;

    try {
      await addBudget({
        variables: {
          category,
          amount: parseFloat(amount),
          month,
          year,
        },
      });

      setCategory('');
      setAmount('');
      setMonth('');
      setYear('');
      await onSuccess();
      setAlert('Budget added!');
      setAlertType('success');
    } catch (err: any) {
      if (err.message.includes('already exists')) {
        setAlert('Budget already exists');
      } else {
        setAlert('Failed to add budget');
      }
      setAlertType('error');
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border border-border rounded-md max-w-md mx-auto mt-6 bg-card"
      >
        <div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {['Food', 'Transport', 'Bills', 'Shopping', 'Entertainment', 'Health', 'Other'].map(
                  (cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ),
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error.category && <p className="text-red-400 text-sm">{error.category}</p>}
        </div>

        <div>
          <input
            type="number"
            placeholder="Budget Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
          {error.amount && <p className="text-red-400 text-sm">{error.amount}</p>}
        </div>

        <div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Month</SelectLabel>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={`${i + 1}`}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {error.month && <p className="text-red-400 text-sm">{error.month}</p>}
        </div>

        <div>
          <input
            type="text"
            placeholder="Year (e.g., 2025)"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 w-full rounded-lg"
          />
          {error.year && <p className="text-red-400 text-sm">{error.year}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground px-4 py-2 rounded"
        >
          {loading ? 'Adding...' : 'Add Budget'}
        </button>
      </form>
    </div>
  );
}
