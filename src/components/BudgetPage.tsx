"use client"

import React, { useEffect, useState } from 'react'
import BudgetForm from '@/components/budgetForm'
import BudgetList from '@/components/budgetList'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useAlert } from '@/context/AlertContext'



type Budget = {
  _id: string
  category: string
  amount: number
  month: string
  year: string
}

const GET_BUDGETS = gql`
  query GetBudgets {
    budgets {
      _id
      category
      amount
      month
      year
    }
  }
`;

interface GetBudgetsData {
  budgets: Budget[];
}

export default  function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const { loading, error, data ,refetch} = useQuery<GetBudgetsData>(GET_BUDGETS);
  const { setAlert, setAlertType } = useAlert();

 useEffect(() => {
    if (data?.budgets) {
      setBudgets(data.budgets);
    }
  }, [data]);

  const handleSuccess = async () => {
    await refetch();
  };

useEffect(() => {
  if (error) {
    console.error("Error loading budgets:", error);
    setAlert("Failed to load Budgets");
    setAlertType("error");
  }
}, [error]);



  return (
    
    <div className="max-w-3xl mx-auto mt-6 p-4">
 
      <BudgetForm onSuccess={handleSuccess} />
     
      <BudgetList budgets={budgets} onSuccess={handleSuccess} loading={loading} />
     
    </div>
   
  )
}
