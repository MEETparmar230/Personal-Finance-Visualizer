import { GraphQLScalarType, Kind } from "graphql";
import { connectDB } from "@/lib/db";
import Budget from "@/lib/models/budget";
import Transaction from "@/lib/models/transaction";

// ✅ Custom scalar for handling Date
const DateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Custom scalar for Date objects in ISO 8601 format",
  serialize(value) {
    // When sending data to client
    return value instanceof Date ? value.toISOString() : value;
  },
  parseValue(value) {
    // When receiving variables from client
    return new Date(value as string);
  },
  parseLiteral(ast) {
    // When receiving inline literals in GraphQL query
    return ast.kind === Kind.STRING ? new Date(ast.value) : null;
  },
});
