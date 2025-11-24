import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const demoUser = {
          id: "1",
          name: "demo user",
          email: "demo@gmail.com",
          passwordHash: await bcrypt.hash("demo123", 10),
        };

        if (email !== demoUser.email) return null;

        const match = await bcrypt.compare(password, demoUser.passwordHash);
        if (!match) return null;

        return {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  }
});

export { handler as GET, handler as POST };
export const authOptions = handler.options;
