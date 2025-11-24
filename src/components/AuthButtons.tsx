'use client';

import { signIn, signOut, useSession } from "next-auth/react";

export default function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
        <button onClick={() => signOut()} className="text-sm text-card-foreground hover:popover px-3 cursor-pointer   rounded-md transition ">LogOut</button>
    );
  }

  return <button onClick={() => signIn("google")} className="text-sm text-card-foreground hover:popover px-3 cursor-pointer  rounded-md transition ">LogIn</button>;
}
