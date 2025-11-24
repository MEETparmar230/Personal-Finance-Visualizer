'use client'

import { useAlert } from "@/context/AlertContext"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import { useEffect } from "react"
import SummaryCards from "./SummaryCards"
import ChartBar from "./ChartBar"
import PieChart from "./PieChart"
import ProgressBar from "./ProgressBar"

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

export default  function HomeClient() {
  const {setAlert,setAlertType} = useAlert()
  const {
    data: txData,
    loading: tLoading,
    error: tError,
  } = useQuery<GetTransactionsData>(GET_TRANSACTIONS);

useEffect(() => {
  if (tError) {
    console.error("Error loading transactions:", tError);
    setAlert("Failed to load Transactions");
    setAlertType("error");
  }
}, [tError]);


  const {
    data: budgetData,
    loading: bLoading,
    error: bError,
  } = useQuery<GetBudgetsData>(GET_BUDGETS);

useEffect(() => {
  if (bError) {
    console.error("Error loading budgets:", bError);
    setAlert("Failed to load Budgets");
    setAlertType("error");
  }
}, [bError]);


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
