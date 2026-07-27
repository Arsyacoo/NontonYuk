import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NontonYuk - Premium Movie Streaming",
  description: "Watch the latest movies in ultra-high quality.",
  icons: {
    icon: "/icon.svg",
  },
};

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { WatchlistProvider } from "./context/watchlist-context";
import { HistoryProvider } from "./context/history-context";
import { ToastProvider } from "./context/toast-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-white`}
      >
        <ToastProvider>
          <WatchlistProvider>
            <HistoryProvider>
              <Navbar />
              {children}
              <Footer />
            </HistoryProvider>
          </WatchlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
