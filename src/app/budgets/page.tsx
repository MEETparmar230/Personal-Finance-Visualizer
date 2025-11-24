// app/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BudgetPage from "@/components/BudgetPage";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <BudgetPage />;
}
