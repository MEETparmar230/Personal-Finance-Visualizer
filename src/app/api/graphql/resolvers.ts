import { GraphQLScalarType, Kind } from "graphql";
import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/budget";
import Transaction from "@/lib/models/transaction";
import type { Document } from "mongoose";
import GraphQLJSON from "graphql-type-json";

// Define interfaces
interface BudgetDoc extends Document {
  category: string;
  amount: number;
  month: string;
  year: string;
  metadata?: Record<string, unknown>;
}

interface TransactionDoc extends Document {
  amount: number;
  date: Date;
  description: string;
  category: string;
  metadata?: Record<string, unknown>;
}

interface AddBudgetArgs {
  category: string;
  amount: number;
  month: string;
  year: string;
  metadata?: Record<string, unknown>;
}

interface AddTransactionArgs {
  amount: number;
  date: Date;
  description: string;
  category: string;
  metadata?: Record<string, unknown>;
}
 interface UpdateBudgetArgs {
  _id: string;
  category: string;
  amount: number;
  month: string;
  year: string;
  metadata?: Record<string, unknown>;
}

 interface DeleteArgs {
  _id: string;
}

 interface UpdateTransactionArgs {
  _id: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
  metadata?: Record<string, unknown>;
}




// ✅ Define custom scalar for Date
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar for Date objects in ISO 8601 format",
  serialize(value) {
    // Outgoing value sent to client
    return value instanceof Date ? value.toISOString() : new Date(value as string).toISOString();
  },
  parseValue(value) {
    // Incoming value from client (variable input)
    return new Date(value as string);
  },
  parseLiteral(ast) {
    // Incoming value from client (inline query)
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

// ✅ Define resolvers
export const resolvers = {
  Date: DateScalar, 
  JSON: GraphQLJSON, 
  Query: {
    budgets: async (): Promise<BudgetDoc[]> => {
      await connectDB();
      return await Budget.find();
    },
    transactions: async (): Promise<TransactionDoc[]> => {
      await connectDB();
      return await Transaction.find().sort({ date: -1 });
    },
  },

  Mutation: {
    addBudget: async (_parent: unknown, args: AddBudgetArgs): Promise<BudgetDoc> => {
      await connectDB();

      const existing = await Budget.findOne({
        category: args.category,
        month: args.month,
        year: args.year,
      });

      if (existing) {
        throw new Error("Budget for this category and month already exists");
      }

      const newBudget = new Budget(args);
      return await newBudget.save();
    },

    updateBudget: async (_parent: unknown,args:UpdateBudgetArgs):Promise<{ success: boolean; message: string; data: BudgetDoc | null }>=>{
      await connectDB();
      const updatedBudget=await Budget.findByIdAndUpdate(args._id,{
        category:args.category,
        amount:args.amount,
        month:args.month,
        year:args.year,
        metadata: args.metadata
      },{new:true});

      if(!updatedBudget){
        return { success: false, message: "Budget not found", data: null };
      }

      return { success: true, message: "Budget updated", data: updatedBudget };
    },

    deleteBudget: async (_parent: unknown,args:DeleteArgs):Promise<{ success: boolean; message: string; data: BudgetDoc | null }>=>{
      await connectDB();
      const deletedBudget=await Budget.findByIdAndDelete(args._id);

      if(!deletedBudget){
        return {success:false,message:"Budget not found",data:null};
      }
     
      return { success: true, message: "Budget deleted", data: deletedBudget };
    },

 addTransaction: async (_parent: unknown, args: AddTransactionArgs): Promise<TransactionDoc> => {
  await connectDB();

  const newTransaction = await Transaction.create({
    amount: args.amount,
    date: args.date,  
    description: args.description,
    category: args.category,
    metadata: args.metadata || {}
  });

  return newTransaction;
}

,

    updateTransaction: async (
      _parent: unknown,
      args: UpdateTransactionArgs
    ): Promise<{ success: boolean; message: string; data: TransactionDoc | null }> => {
      await connectDB();

      try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
          args._id,
          {
            amount: args.amount,
            date: new Date(args.date),
            description: args.description,
            category: args.category,
            metadata: args.metadata,
          },
          { new: true }
        );

        if (!updatedTransaction) {
          return { success: false, message: "Transaction not found", data: null };
        }

        return { success: true, message: "Transaction updated", data: updatedTransaction };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to update transaction";
        return { success: false, message: errorMsg, data: null };
      }
    },

    deleteTransaction: async (_parent: unknown,args:DeleteArgs):Promise<{ success: boolean; message: string; data: TransactionDoc | null }>=>{
      await connectDB();
      const deletedTransaction=await Transaction.findByIdAndDelete(args._id);

      if(!deletedTransaction){
        return { success: false, message: "Transaction not found", data: null };
      }

      return { success: true, message: "Transaction deleted", data: deletedTransaction };
    },

  },
};
