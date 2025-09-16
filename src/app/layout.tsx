import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import AuthGate from "./components/AuthGate";
import { ProfileProvider } from "./context/ProfileContext"; // ✅ Import ProfileProvider
import "katex/dist/katex.min.css";
import RouteLoader from "./components/RouteLoader";

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

export const metadata: Metadata = {
  title: "EduimMersion",
  description: "A platform for immersive learning",
  icons: {
    icon: "images/favicon.svg",
    apple: "images/favicon.svg",
    shortcut: "images/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body className="antialiased font-poppins">
        <RouteLoader />
        <LanguageProvider>
          <ProfileProvider>
            {" "}
            {/* ✅ Added ProfileProvider wrapper */}
            <AuthGate>{children}</AuthGate>
          </ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
