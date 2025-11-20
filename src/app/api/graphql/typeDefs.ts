export const typeDefs = `#graphql
  scalar Date
  scalar JSON

  type Budget {
    _id: ID!
    category: String
    amount: Float
    month: String
    year: String
    metadata: JSON
  }

  type Transaction {
    _id: ID!
    amount: Float
    date: Date
    description: String
    category: String
        metadata: JSON

  }

  type Query {
    budgets: [Budget]
    transactions: [Transaction]
    metadata: JSON

  }


  type Mutation {
    addBudget(category: String!, amount: Float!, month: String!, year: String!): Budget
    addTransaction(amount: Float!, date: Date!, description: String!, category: String!): Transaction

    updateBudget(_id: ID!,category: String!, amount: Float!, month: String!, year: String!): MutationResponseBudget
    deleteBudget(_id: ID!): MutationResponseBudget

    updateTransaction(_id:ID!, amount: Float!, date: Date!, description: String!, category: String!): MutationResponseTransaction
    deleteTransaction(_id: ID!): MutationResponseTransaction
  }

  type MutationResponseTransaction {
  success: Boolean!
  message: String!
  data: Transaction

}
  type MutationResponseBudget {
  success: Boolean!
  message: String!
  data: Budget

}

`;
