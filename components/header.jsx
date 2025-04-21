import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {

  await checkUser();

  return (
    <div className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b z-50 shadow-sm">
      <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        
        {/* Logo */}
        <Link href="/">
          <Image
            src="/logo2.png"
            alt="Welth logo"
            width={200}
            height={60}
            className="h-16 md:h-20 w-auto object-contain transition-all duration-300"
          />
        </Link>
  
        {/* Navigation Links (only for signed out users) */}
        <div className="hidden md:flex items-center gap-8">
          <SignedOut>
            <a href="#features" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
              Testimonials
            </a>
          </SignedOut>
        </div>
  
        {/* Auth Buttons & User Avatar */}
        <div className="flex items-center gap-3 md:gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2 text-sm">
                <LayoutDashboard size={18} />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>
  
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 text-sm">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
  
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="text-sm">Login</Button>
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
    </div>
  );
  
}

export default Header
