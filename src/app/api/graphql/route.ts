import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./typeDefs";
import { resolvers } from "./resolvers";
import { NextRequest } from "next/server";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export interface GraphQLContext {
  user: {
    email?: string | null;
    name?: string | null;
    image?: string | null;
  } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (_req: NextRequest): Promise<GraphQLContext> => {
    const session = await getServerSession(authOptions) as Session | null;
    return {
      user: session?.user ?? null,
    };
  },
});

export async function POST(req: NextRequest) {
  return handler(req);
}

export function GET() {
  return new Response("GraphQL endpoint is live", { status: 200 });
}