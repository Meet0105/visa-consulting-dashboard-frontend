import "./../styles/globals.css";
import React from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "Visa Consulting Dashboard",
  description: "Professional visa consulting management system with multi-role dashboards for admins, managers, and users",
  keywords: "visa consulting, immigration, dashboard, management system",
  authors: [{ name: "Visa Consulting Team" }],
  robots: "index, follow",
  openGraph: {
    title: "Visa Consulting Dashboard",
    description: "Professional visa consulting management system",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode; }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <div id="root" className="h-full">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
