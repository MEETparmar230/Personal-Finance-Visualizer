import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import Budget from '@/lib/models/budget'
import mongoose from 'mongoose'

const MONGO_LINK = process.env.MONGO_LINK!

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }

  const id = context.params.id
  const body = await req.json()

  try {
    const updatedBudget = await Budget.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(updatedBudget, { status: 200 })
  } catch (err) {
    console.error('Failed to update budget:', err)
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, context: { params: { id: string } }) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }

  const id = context.params.id

  try {
    await Budget.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Failed to delete budget:', err)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
