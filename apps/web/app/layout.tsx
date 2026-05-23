import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}
