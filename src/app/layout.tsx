import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERC-8183 Agent Commerce Simulator | @samdevrel",
  description: "Interactive demo of the Agentic Commerce Protocol - trustless job escrow for AI agents. Visualize the ERC-8183 state machine and understand how agents can do work with guaranteed payment.",
  keywords: ["ERC-8183", "Ethereum", "AI agents", "escrow", "agentic commerce", "Web3", "smart contracts"],
  authors: [{ name: "Sam", url: "https://x.com/samdevrel" }],
  openGraph: {
    title: "ERC-8183 Agent Commerce Simulator",
    description: "Trustless job escrow for AI agents. The escrow layer that guarantees payment for agent work.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@samdevrel",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
