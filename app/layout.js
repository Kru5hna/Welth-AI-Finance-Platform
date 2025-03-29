import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";



const inter = Inter({subset: ['latin']})

export const metadata = {
  title: "Welth",
  description: "One Stop Finance Platform ",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
      <body
        className={`${inter.className}`}
      >
        {/* header */}
        <Header />
        <main className="min-h-screen">

        {children}
        </main>

        {/* footer */}
      <footer className="text-gray-600 bg-blue-100 p-12 text-center">
      <div className="container mx-auto px-4">
      <p>Made with 💝 By Krushna</p> 
      </div>
      </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
