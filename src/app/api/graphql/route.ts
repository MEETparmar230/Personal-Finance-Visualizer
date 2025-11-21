import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { NextRequest } from "next/server";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export async function POST(req: NextRequest) {
  return handler(req);
}

export async function GET() {
  return new Response("GraphQL endpoint is live", { status: 200 });
}