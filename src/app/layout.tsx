import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Metadata
export const metadata: Metadata = {
  title: "EdulmMersion",
  description: "A platform for immersive learning",
  icons: {
    icon: "images/favicon.svg",
    apple: "images/favicon.svg",
    shortcut: "images/favicon.svg",
  },
};

// Root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body className="antialiased font-poppins">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
