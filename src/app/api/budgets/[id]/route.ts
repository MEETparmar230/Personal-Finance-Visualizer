import { NextRequest, NextResponse } from 'next/server'
import Budget from '@/lib/models/budget'
import mongoose from 'mongoose'

const MONGO_LINK = process.env.MONGO_LINK!

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK)
  }
}

function getIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url)
  const segments = url.pathname.split('/')
  return segments[segments.length - 1] || null
}

export async function PUT(req: NextRequest) {
  await connectDB()

  const id = getIdFromUrl(req)
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  const body = await req.json()

  try {
    const updatedBudget = await Budget.findByIdAndUpdate(id, body, { new: true })
    return NextResponse.json(updatedBudget, { status: 200 })
  } catch (err) {
    console.error('Failed to update budget:', err)
    return NextResponse.json({ error: 'Failed to update budget' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  await connectDB()

  const id = getIdFromUrl(req)
  if (!id) {
    return NextResponse.json({ error: 'Missing ID' }, { status: 400 })
  }

  try {
    await Budget.findByIdAndDelete(id)
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Failed to delete budget:', err)
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 })
  }
}
