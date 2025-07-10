import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AlertProvider } from "@/context/AlertContext";
import AlertDisplay from "@/components/AlertDisplay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Finance Visualizer",
  description: "Track your budget and spending",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-200 text-black min-h-screen min-w-screen`}
      >
        <AlertProvider>
          <AlertDisplay />
          <Navbar  />
          <div className="mt-14">
          {children}
          </div>
        </AlertProvider>
      </body>
    </html>
  );
}
