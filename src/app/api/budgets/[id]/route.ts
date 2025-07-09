import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Budget from '@/lib/models/budget'

export async function PUT(req: NextRequest) {
  await connectDB()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop() // extract [id]

  const body = await req.json()
  const updated = await Budget.findByIdAndUpdate(id, body, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  await connectDB()

  const url = new URL(req.url)
  const id = url.pathname.split('/').pop()

  await Budget.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_LINK!)
  }
}
