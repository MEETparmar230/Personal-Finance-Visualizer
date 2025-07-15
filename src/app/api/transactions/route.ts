import { NextResponse } from 'next/server'
import Transaction from '@/lib/models/transaction'
import mongoose from 'mongoose'

const MONGO_LINK:string|undefined = process.env.MONGO_LINK

export async function POST(req: Request) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK!)
  }

  const body = await req.json()

  try {
    const { amount, date, description, category } = body

 
    const [day, month, year] = date.split('/')
    const isoDate = new Date(`${year}-${month}-${day}`) // e.g., 2025-07-14

    const newTransaction = await Transaction.create({
      amount,
      date: isoDate,
      description,
      category
    })

    return NextResponse.json(newTransaction, { status: 201 })
  } catch (error) {
    console.error('Transaction creation failed:', error)
    return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
  }
}


export async function GET(){
  if(mongoose.connection.readyState === 0){
        await mongoose.connect(MONGO_LINK!)
    }
    try{
      const data = await Transaction.find({}).sort({date:-1})
     return NextResponse.json(data,{status:200})
    }
    catch(err){
      console.error('data fetching from MongoDB failed',err)
     return NextResponse.json({error:'Failed to fetch transactions'},{status:500})
    }
}


