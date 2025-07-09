import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Transaction from '@/lib/models/transaction'

const MONGO_LINK = process.env.MONGO_LINK!

// DELETE /api/transactions/[id]
export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }

  const ID = context.params.id

  try {
    await Transaction.findByIdAndDelete(ID)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Some error occurred while deleting transaction:', err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PUT /api/transactions/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }

  const ID = context.params.id
  const body = await req.json()

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(ID, body, { new: true })
    return NextResponse.json(updatedTransaction, { status: 200 })
  } catch (err) {
    console.error('Data updation on MongoDB failed:', err)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}
