import Budget from "@/lib/models/budget";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGO_LINK = process.env.MONGO_LINK!;

async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK);
  }
}

// PUT: Update Budget
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const id = params.id;
  const body = await req.json();

  try {
    const updatedBudget = await Budget.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updatedBudget, { status: 200 });
  } catch (err) {
    console.error("Failed to update budget:", err);
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}

// DELETE: Delete Budget
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  await connectToDB();
  const id = params.id;

  try {
    await Budget.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Failed to delete budget:", err);
    return NextResponse.json({ error: "Failed to delete budget" }, { status: 500 });
  }
}
