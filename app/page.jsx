import HeroSection from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { Vortex } from "@/components/ui/vortex";
import { featuresData, howItWorksData, testimonialsData } from "@/data/landing";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mt-35 text-white min-h-screen">
       
      {/* Static/Animated Background */}
      <div className="absolute inset-0 z-0">
        <Vortex
          backgroundColor="#000000"
          particleCount={250}
          baseHue={200}         // bluish glow
          rangeY={400}
          baseRadius={1.2}
          rangeRadius={1.5}
          baseSpeed={0.15}
          rangeSpeed={0.3}
          className="w-[100vw] h-[100vh] mt-20"
        />
      </div>

        <HeroSection />

        {/* Features */}
        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything you need to manage your finances
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuresData.map((feature, index) => (
                <Card 
                  key={index} 
                  className="p-6 bg-zinc-900 border-zinc-800 hover:border-zinc-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
                >
                  <CardContent className="space-y-4 pt-4">
                    <div className="text-blue-500 group-hover:text-blue-400 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl text-white font-semibold">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

       <section className="py-24 bg-black/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorksData.map((step, index) => (
                <div key={index} className="group hover:-translate-y-2 transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-400 group-hover:bg-blue-500/20">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 bg-black/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonialsData.map((testimonial, index) => (
                <Card
                  key={index}
                  className="p-6 bg-zinc-900/70 border border-zinc-800 hover:border-purple-400/30 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <CardContent>
                    <div className="flex items-center mb-4">
                      <Image
                        src="/pfp.jpg"
                        alt={`${testimonial.name}'s profile`}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-zinc-700"
                      />
                      <div className="ml-4">
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 italic">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
    </main>
  );
}