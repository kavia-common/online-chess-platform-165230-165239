import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ocean Chess",
  description: "Web-based Chess — Ocean Professional Theme",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={
          "min-h-screen bg-gradient-to-br from-blue-500/10 to-gray-50 text-[#111827] antialiased transition-colors duration-300 font-sans"
        }
        suppressHydrationWarning
      >
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
