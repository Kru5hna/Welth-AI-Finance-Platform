import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";



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
        className={`${inter.className} bg-zinc-900`}
      >
        {/* header */}
        <Header />
        <main className="min-h-screen">

        {children}
        </main>
        <Toaster richColors/>

        {/* footer */}
      <footer className="text-gray-200 p-12 text-center">
      <div className="container mx-auto px-4">
      <p className="text-xl">Made with 💝 By Krushna</p> 
      </div>
      </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
