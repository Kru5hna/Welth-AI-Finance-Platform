"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image";
import { useEffect, useRef } from "react";

const HeroSection = () => {


   const imageRef = useRef(null);

   useEffect(() => {
      const imageElement = imageRef.current;
      if (!imageElement) return;
   
      const handleScroll = () => {
         const scrollPos = window.scrollY;
         const scrollThreshold = 100;
   
         if (scrollPos > scrollThreshold) {
            imageElement.classList.add("scrolled");
         } else {
            imageElement.classList.remove("scrolled");
         }
      };
   
      window.addEventListener("scroll", handleScroll);
   
      return () => window.removeEventListener("scroll", handleScroll);
   }, [imageRef]);
   


  return (
    <div className="pb-20 px-4">
      <div className="container mx-auto text-center">
         <h1 className="text-5xl md:text-8xl lg:text-[105px] gradient-title">
            Manage Your Finances <br />
            with Intelligence
         </h1>
         <p>
         An AI-powered financial management platform that helps you track, analyze, and optimize your spending with real-time insights.
         </p>

         <div className="">
            <Link href='/dashboard'>
            {/* <Button size="lg" className="px-8">
               Get Started
            </Button> */}

<button className="p-[3px] relative mr-5 mt-5">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent cursor-pointer">
    Get Started
  </div>
</button>

</Link>
{/* // Button code */}
        <Link href="https://www.youtube.com/watch?v=egS6fnZAdzk&">
        <button className="inline-flex h-10 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer gap-4">
          Watch Demo
        </button>
  
        </Link>
      

         </div>

         <div className="hero-image-wrapper">
            <div ref={imageRef} className="hero-image">
               <Image 
                src="/banner.jpeg"
                width={1100} 
                height={400}
                alt="Dashboard Preview"
                className="mt-4 rounded-lg shadow-2xl border mx-auto"
                priority
                />
            </div>
         </div>


      </div>
    </div>
  )
}

export default HeroSection

