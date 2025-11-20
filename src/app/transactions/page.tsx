'use client'
import TransactionForm from '@/components/TransactionForm'
import TransactionList from '@/components/TransactionList'
import { useAlert } from '@/context/AlertContext'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'



type Transaction = {
  _id: string
  amount: number
  date: string
  description: string
  category: string
}

const GET_TRANSACTIONS = gql`
  query GetTransactions {
    transactions{
      _id
      amount
      date
      description
      category
    }
  }
`
interface GetTransactionsData {
  transactions:Transaction[]
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const {loading,error,refetch,data} = useQuery<GetTransactionsData>(GET_TRANSACTIONS)
  const {setAlert,setAlertType} = useAlert();

  const fetchData = async ()=>{
    await refetch()
  }

  useEffect(() => {
    if(data?.transactions){
    setTransactions(data?.transactions)
    }
  }, [data])

  useEffect(()=>{
    if(error){
    setAlert("Failed to load Transactions")
    setAlertType("error")
    }
  },[error])


  return (
    <main className="p-4 ">
      <TransactionForm onSuccess={fetchData} />
      <TransactionList transactions={transactions} onSuccess={fetchData} loading={loading} />
    </main>
  )
}
