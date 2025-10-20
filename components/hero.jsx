"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef } from "react"

const HeroSection = () => {
  const imageRef = useRef(null)

  useEffect(() => {
    const imageElement = imageRef.current
    if (!imageElement) return

    const handleScroll = () => {
      const scrollPos = window.scrollY
      const scrollThreshold = 100

      if (scrollPos > scrollThreshold) {
        imageElement.classList.add("scrolled")
      } else {
        imageElement.classList.remove("scrolled")
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [imageRef])

  return (
    <section className="pb-20 px-4 relative">
      
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl lg:text-8xl xl:text-[105px] gradient-title pb-6 leading-tight">
          Manage Your Finances <br />
          with Intelligence
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          An AI-powered financial management platform that helps you track, analyze, 
          and optimize your spending with real-time insights.
        </p>

        <Link href="/dashboard" className="inline-block group">
          <button className="group relative p-[3px] mt-5 overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <span className="relative block px-8 py-3 bg-slate-950 rounded-[6px] text-white font-medium transition-all duration-200 group-hover:bg-transparent cursor-pointer">
              Get Started
            </span>
          </button>
        </Link>

        <div className="hero-image-wrapper mt-2">
          
          <div ref={imageRef} className="hero-image group">
            <Image 
              src="/banner.png"
              width={1000} 
              height={350}
              alt="Dashboard Preview - Financial Management Interface"
              className="rounded-lg shadow-2xl shadow-blue-500/20 border border-zinc-800 mx-auto hover:scale-[1.02] transition-all duration-500 hover:shadow-blue-500/30"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection