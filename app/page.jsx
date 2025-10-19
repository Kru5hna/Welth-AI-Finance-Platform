import HeroSection from "@/components/hero";
import { Card, CardContent } from "@/components/ui/card";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mt-40 text-white min-h-screen">
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
                className="p-6 bg-zinc-800 border-zinc-800 hover:border-zinc-700 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group"
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="text-blue-500 group-hover:text-blue-400 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl text-white font-semibold">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorksData.map((step, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300 border-amber-300">
                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500 group-hover:bg-blue-500/20 group-hover:border-blue-500/40 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <Card 
                key={index} 
                className="p-6 bg-black border-zinc-800 hover:border-zinc-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300"
              >
                <CardContent className="pt-4">
                  <div className="flex items-center mb-4">
                    <Image 
                      src={testimonial.image}
                      alt={`${testimonial.name}'s profile picture`}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border-2 border-zinc-700"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-300">{testimonial.role}</p>
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