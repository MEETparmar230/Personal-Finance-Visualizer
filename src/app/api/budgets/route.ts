import Budget from "@/lib/models/budget";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const MONGO_LINK = process.env.MONGO_LINK!;
type BudgetFilter = {
  month?: string;
  year?: string;
};



async function connectToDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGO_LINK);
  }
}

export async function GET(req: NextRequest) {


  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGO_LINK);
    }

    const searchParams = req.nextUrl.searchParams;
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    const filter:BudgetFilter= {};
    if (month) filter.month = month;
    if (year) filter.year = year;

    const res = await Budget.find(filter);

   
    return NextResponse.json(res ?? [], { status: 200 });
  } catch (err) {
    console.error("Can't fetch budget from database:", err);

    return NextResponse.json(
      { error: "Failed to fetch budget" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}


export async function POST(req: Request) {
  await connectToDB();


  try {
    const body = await req.json();
    const existing = await Budget.findOne({
  category: body.category,
  month: body.month,
  year: body.year,
});

if (existing) {
  return NextResponse.json(
    { error: 'Budget for this category already exists for this month and year' },
    { status: 409 }
  );
}
    const newBudget = await Budget.create(body);
    return NextResponse.json(newBudget, { status: 201 });
  } catch (err) {
    console.error("Error while creating budget:", err);
    return NextResponse.json(
      { error: "Failed to create budget" },
      { status: 500 }
    );
  }
}
