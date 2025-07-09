import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import Transaction from '@/lib/models/transaction'


const MONGO_LINK = process.env.MONGO_LINK

export async function DELETE(_: Request, { params }: { params: { id: string } }) {

  if(mongoose.connection.readyState === 0){
    await mongoose.connect(MONGO_LINK!)
  }
  try{
    const ID = params.id;
    await Transaction.findByIdAndDelete(ID)
    return NextResponse.json({ success: true }, { status: 200 })
  }
  catch(err){
    console.error("some error occured while deleting transaction",err)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}


export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
  if(mongoose.connection.readyState === 0){
   await mongoose.connect(MONGO_LINK!)
  }
    const body =await req.json();
    const ID = params.id;
  try{
 const updatedTransaction = await Transaction.findByIdAndUpdate(ID,body,{new:true})
    return NextResponse.json(updatedTransaction, { status: 200 })
  }
  catch(err){
      console.error('data updation on MongoDB failed',err)
     return NextResponse.json({error:'Failed to update transactions'},{status:500})
    }
}