'use client'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from "@/src/messages.json"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, Lock, Zap } from "lucide-react"

function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24">
        
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-purple-300">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          100% Anonymous Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 tracking-tight text-center">
          Dive Into The World Of{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Anonymous Feedback
          </span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl text-center mb-10 leading-relaxed">
          Share your unique link and receive honest, unfiltered messages from anyone — completely anonymous, completely safe.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/sign-up">
            <Button className="bg-purple-600 hover:bg-purple-700 px-8 py-6 text-lg rounded-xl gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-12 text-center">
          {[
            { value: "10K+", label: "Users" },
            { value: "50K+", label: "Messages Sent" },
            { value: "100%", label: "Anonymous" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Carousel Section */}
      <section className="flex flex-col items-center py-16 px-4 bg-white/5 backdrop-blur-sm">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What People Are{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Saying
          </span>
        </h2>
        <p className="text-gray-400 text-center mb-10 max-w-xl">
          Real anonymous messages shared on our platform every day.
        </p>

        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-sm md:max-w-lg"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-2">
                  <Card className="bg-gray-800 border border-white/10 rounded-2xl shadow-xl">
                    <CardHeader className="text-lg font-bold text-purple-300 text-center pt-6">
                      {message.title}
                    </CardHeader>
                    <CardContent className="flex items-center justify-center p-6">
                      <p className="text-gray-300 text-center text-base leading-relaxed">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="border-white/20 text-white hover:bg-white/10" />
          <CarouselNext className="border-white/20 text-white hover:bg-white/10" />
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-14">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Feedback Mystery?
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Lock className="w-6 h-6 text-purple-400" />,
                title: "100% Anonymous",
                desc: "No accounts needed for senders. Complete privacy guaranteed.",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
              {
                icon: <Zap className="w-6 h-6 text-yellow-400" />,
                title: "Instant Delivery",
                desc: "Messages delivered instantly to your dashboard. No delays.",
                bg: "bg-yellow-500/10 border-yellow-500/20",
              },
              {
                icon: <MessageCircle className="w-6 h-6 text-blue-400" />,
                title: "AI Suggestions",
                desc: "AI helps senders craft the perfect honest message.",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} border flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-white/10 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to hear the truth?
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands getting honest feedback every day.
          </p>
          <Link href="/sign-up">
            <Button className="bg-purple-600 hover:bg-purple-700 px-10 py-6 text-lg rounded-xl gap-2">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-600 text-sm">
        © 2024 Feedback Mystery. All rights reserved.
      </footer>

    </main>
  )
}

export default Home