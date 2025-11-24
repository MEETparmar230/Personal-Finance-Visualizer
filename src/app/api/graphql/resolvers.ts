import { GraphQLScalarType, Kind } from "graphql";
import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/budget";
import Transaction from "@/lib/models/transaction";
import type { Document } from "mongoose";
import GraphQLJSON from "graphql-type-json";
import type { GraphQLContext } from "@/app/api/graphql/route"; 


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
    budgets: async (_parent: unknown,_args: unknown,context: GraphQLContext): Promise<BudgetDoc[]> => {
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();
      const budgets = await Budget.find({userEmail:context.user.email}).sort({ month: 1, year: -1 });

       return (budgets?  budgets :  [])
    },
    transactions: async (_parent: unknown,_args: unknown,context: GraphQLContext): Promise<TransactionDoc[]> => {
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();
       const transactions = await Transaction.find({userEmail:context.user.email}).sort({ date: -1 });
       return transactions || [];
    },
  },

  Mutation: {
    addBudget: async (_parent: unknown, args: AddBudgetArgs,context: GraphQLContext): Promise<BudgetDoc> => {
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();

      const existing = await Budget.findOne({
        category: args.category,
        month: args.month,
        year: args.year,
        userEmail: context.user.email,
      });

      if (existing) {
        throw new Error("Budget for this category and month already exists");
      }

      const newBudget = new Budget({
        ...args,
        userEmail: context.user.email,
      });
      
      return await newBudget.save();
    },

    updateBudget: async (_parent: unknown,args:UpdateBudgetArgs,context: GraphQLContext):Promise<{ success: boolean; message: string; data: BudgetDoc | null }>=>{
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();
     const updatedBudget = await Budget.findOneAndUpdate(
      { _id: args._id, userEmail: context.user.email },
      { ...args },
      { new: true }
    );

      if (!updatedBudget)
      return { success: false, message: "Not found or unauthorized", data: null };

      return { success: true, message: "Budget updated", data: updatedBudget };
    },

    deleteBudget: async (_parent: unknown,args:DeleteArgs,context: GraphQLContext):Promise<{ success: boolean; message: string; data: BudgetDoc | null }>=>{
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();
      const deletedBudget = await Budget.findOneAndDelete({
      _id: args._id,
      userEmail: context.user.email,
    });

     if (!deletedBudget)
      return { success: false, message: "Not found or unauthorized", data: null };
     
      return { success: true, message: "Budget deleted", data: deletedBudget };
    },

 addTransaction: async (_parent: unknown, args: AddTransactionArgs, context: GraphQLContext): Promise<TransactionDoc> => {
        if (!context.user) {
        throw new Error("Unauthorized");
      }
  await connectDB();

  const newTransaction = await Transaction.create({
    ...args,
    userEmail: context.user.email, 
  });

  return newTransaction;
}

,

    updateTransaction: async (
      _parent: unknown,
      args: UpdateTransactionArgs,
      context: GraphQLContext
    ): Promise<{ success: boolean; message: string; data: TransactionDoc | null }> => {
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();

      try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: args._id, userEmail: context.user.email },
      { ...args },
      { new: true }
    );


         if (!updatedTransaction)
      return { success: false, message: "Not found or unauthorized", data: null };

        return { success: true, message: "Transaction updated", data: updatedTransaction };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Failed to update transaction";
        return { success: false, message: errorMsg, data: null };
      }
    },

    deleteTransaction: async (_parent: unknown,args:DeleteArgs, context: GraphQLContext):Promise<{ success: boolean; message: string; data: TransactionDoc | null }>=>{
            if (!context.user) {
        throw new Error("Unauthorized");
      }
      await connectDB();
const deletedTransaction = await Transaction.findOneAndDelete({
      _id: args._id,
      userEmail: context.user.email,
    });
     
    
     if (!deletedTransaction)
      return { success: false, message: "Not found or unauthorized", data: null };

      return { success: true, message: "Transaction deleted", data: deletedTransaction };
    },

  },
};
