import Budget from "@/lib/models/budget";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGO_LINK = process.env.MONGO_LINK;



export async function PUT(req:NextRequest,{params}:{params:{id:string}}){
    if(mongoose.connection.readyState === 0){
       await mongoose.connect(MONGO_LINK!)
    }
    const id = params.id;
    const body =await req.json()

    try{
        const newBudget = await Budget.findByIdAndUpdate(id,body,{new:true});
       return NextResponse.json(newBudget,{status:200});
    }
    catch(err){
        console.error("Failed to update budget:",err)
      return  NextResponse.json({ error: 'Failed to Update budget' },{status:500})
    }

}

export async function DELETE({params}:{params:{id:string}}){
    if(mongoose.connection.readyState === 0){
       await mongoose.connect(MONGO_LINK!)
    }

    const id = params.id;

    try{
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
    }
    catch (err) {
    console.error('Failed to delete budget:', err);
    return NextResponse.json({ error: 'Failed to delete budget' }, { status: 500 });
  }
}