// app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TransactionsPage from "@/components/TransactionsPage";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <TransactionsPage />;
}
