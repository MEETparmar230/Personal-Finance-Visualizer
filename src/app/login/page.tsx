"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="md:mt-50 mt-30 w-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md bg-card shadow-lg border border-border rounded-xl p-8">
        
        {/* Header */}
        <h1 className="text-2xl font-semibold text-card-foreground mb-2">
          Welcome Back
        </h1>
        <p className="text-muted-foreground mb-6 text-sm">
          Login with placeholder credentials or Google
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm block mb-1 text-muted-foreground">
            Email
          </label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
            placeholder="demo@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm block mb-1 text-muted-foreground">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:ring-2 focus:ring-ring focus:outline-none text-foreground"
            placeholder="demo123"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition mb-4"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-muted-foreground text-xs">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Google Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}

          className="w-full py-2 rounded-lg bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Login with Google
        </button>
      </div>
    </div>
  );
}
