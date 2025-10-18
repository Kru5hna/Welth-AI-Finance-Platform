import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox, TrendingUp } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
  await checkUser()

  return (
    <header className="fixed top-0 w-full backdrop-blur-lg border-b z-50">
      <nav className="container mx-auto flex items-center justify-between px-4 py-6 md:py-6">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-white p-2 rounded-lg transition-colors">
            <TrendingUp className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-2xl tracking-wider font-bold text-white ">
            Welth
          </span>
        </Link>
  
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <SignedOut>
            <a 
              href="#features" 
              className="text-sm font-medium tracking-wide text-white hover:scale-110 transition-all duration-200"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              className="text-sm font-medium text-white tracking-wide  hover:scale-110 transition-all duration-200"
            >
              Testimonials
            </a>
          </SignedOut>
        </div>
  
        {/* Auth Buttons & User */}
        <div className="flex items-center gap-3 md:gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
  
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 text-sm  border-white hover:bg-gray-800 cursor-pointer">
                <PenBox size={18} />
                <span className="hidden md:inline ">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
  
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="text-sm cursor-pointer">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
  
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 md:w-10 md:h-10',
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  )
}

export default Header