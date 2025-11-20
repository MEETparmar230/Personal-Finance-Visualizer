'use client'

import { gql } from '@apollo/client'

import SummaryCards from '@/components/SummaryCards'
import ChartBar from '@/components/ChartBar'
import PieChart from '@/components/PieChart'
import ProgressBar from '@/components/ProgressBar'
import { useQuery } from '@apollo/client/react'
import { useAlert } from '@/context/AlertContext'

type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}


type Budget = {
  _id: string
  category: string
  amount: number
  month: string
  year: string
}

interface GetTransactionsData {
  transactions: Transaction[];
}

interface GetBudgetsData {
  budgets: Budget[];
}


const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions {
      _id
      amount
      date
      description
      category
    }
  }
`;

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

export default function Home() {
  const {setAlert,setAlertType} = useAlert()
  const {
    data: txData,
    loading: tLoading,
    error: tError,
  } = useQuery<GetTransactionsData>(GET_TRANSACTIONS);

  if (tError) {
    setAlert("Failed to load Transactions");
    setAlertType("error");
  }

  const {
    data: budgetData,
    loading: bLoading,
    error: bError,
  } = useQuery<GetBudgetsData>(GET_BUDGETS);

  if (bError) {
    setAlert("Failed to load Budgets");
    setAlertType("error");
  }

  const transactions:Transaction[] = txData?.transactions || [];
  const budgets:Budget[] = budgetData?.budgets|| [];

  return (
    <main className="p-4 bg-background">
      <SummaryCards transactions={transactions} tLoading={tLoading}/>
      <ChartBar transactions={transactions} tLoading={tLoading}/>
      <PieChart />
      <ProgressBar budgets={budgets} transactions={transactions} loading={(bLoading&&tLoading)}/>
    </main>
  )
}
