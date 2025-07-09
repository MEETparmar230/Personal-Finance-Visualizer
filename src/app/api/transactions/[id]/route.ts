import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Transaction from '@/lib/models/transaction'

const MONGO_LINK = process.env.MONGO_LINK!

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }
}

export async function PUT(req: NextRequest) {
  await connectDB()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() // get the [id] from URL

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const body = await req.json()

  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(updatedTransaction, { status: 200 })
  } catch (err) {
    console.error('Failed to update transaction:', err)
    return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  try {
    await Transaction.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Failed to delete transaction:', err)
    return NextResponse.json({ error: 'Failed to delete transaction' }, { status: 500 })
  }
}
