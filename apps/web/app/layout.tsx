import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ChatWidget } from "@/components/chat/chat-widget";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Product Platform",
  description: "Conversational Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider>
          <main className="min-h-screen relative">
            {children}
          </main>
          <ChatWidget />
        </ClerkProvider>
      </body>
    </html>
  );
}
