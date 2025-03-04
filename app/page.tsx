import { Button } from "@/components/ui/button"
import { ChevronRight, Cloud, Zap, Users, TestTube, Headset, PlugIcon as Pipeline, Bot, Lock } from "lucide-react"
import ParallaxBackground from "@/components/parallax-background"
import FeatureCard from "@/components/feature-card"
import AnimatedSection from "@/components/animated-section"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-foreground overflow-hidden">
      <ParallaxBackground />
      <Navbar />

      {/* Hero Section */}
      <AnimatedSection className="relative z-10">
        <video autoPlay muted loop style={{ backgroundSize: "cover" }} className="min-w-full min-h-full dark:opacity-30 opacity-80 absolute -z-10">
          <source src="/vid1.mp4" type="video/mp4" />
        </video>
        <div className="container bg-clip-text mx-auto px-4 pt-32 pb-20 flex flex-col items-center text-center dark:bg-transparent bg-gray-100 bg-opacity-80">
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-cyan-500 to-purple-600 mb-6">
            The Collaborative Cloud Browser
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mb-10 text-orange-400 font-semibold">
            Supercharge your team's workflow with AI-powered automation in a collaborative browser environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Get Started <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700">
              Book a Demo
            </Button>
          </div>
        </div>
      </AnimatedSection>

      {/* Features Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-black/80 to-gray-900/80 dark:bg-clip-text">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 dark:text-foreground text-gray-400">Powerful Features for Modern Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bot className="h-10 w-10 text-purple-400" />}
              title="AI-Powered Automation"
              description="Automate repetitive tasks with intelligent AI that learns from your team's actions"
            />
            <FeatureCard
              icon={<Cloud className="h-10 w-10 text-cyan-400" />}
              title="Cloud-Native Browser"
              description="Access your browsing environment from anywhere, with all your tools and settings intact"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-purple-400" />}
              title="Real-Time Collaboration"
              description="Work together in the same browser session with multiple team members simultaneously"
            />
            <FeatureCard
              icon={<TestTube className="h-10 w-10 text-cyan-400" />}
              title="Advanced Testing Tools"
              description="Test across multiple environments and configurations with a single click"
            />
            <FeatureCard
              icon={<Headset className="h-10 w-10 text-purple-400" />}
              title="Customer Support Integration"
              description="Seamlessly guide and assist customers directly within their browser session"
            />
            <FeatureCard
              icon={<Pipeline className="h-10 w-10 text-cyan-400" />}
              title="Customizable Pipelines"
              description="Create and optimize workflows for any process with visual pipeline builders"
            />
          </div>
        </div>
      </AnimatedSection>

      {/* Use Cases Section */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Designed for Every Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-purple-500/10">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="Cyqle dashboard interface"
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Development Teams</h3>
                </div>
                <p className="text-gray-400">
                  Collaborate on code, test features, and debug issues together in real-time.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-cyan-500/20 p-2 rounded-lg mr-4">
                    <TestTube className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">QA & Testing</h3>
                </div>
                <p className="text-gray-400">Automate test scenarios and share results instantly with your team.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-purple-500/20 p-2 rounded-lg mr-4">
                    <Headset className="h-6 w-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Customer Support</h3>
                </div>
                <p className="text-gray-400">
                  See what your customers see and guide them through solutions effortlessly.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="bg-cyan-500/20 p-2 rounded-lg mr-4">
                    <Zap className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Operations</h3>
                </div>
                <p className="text-gray-400">
                  Build and optimize workflows with visual pipeline tools and AI assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* AI Automation Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-b from-gray-900/80 to-black/80">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-300 dark:text-foreground">AI-Powered Automation That Learns</h2>
              <p className="text-gray-300 text-lg">
                Cyqle's intelligent AI observes your team's actions and automates repetitive tasks, saving hours of
                manual work.
              </p>
              <ul className="space-y-4">
                {[
                  "Record and replay complex browser interactions",
                  "AI suggests automation opportunities based on patterns",
                  "Schedule automated tasks to run at specific times",
                  "Share automation scripts across your organization",
                  "Integrate with your existing tools and workflows",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full p-1 mr-3 mt-1">
                      <ChevronRight className="h-4 w-4 text-black" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-6 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                Explore AI Features
              </Button>
            </div>
            <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/10">
              <img
                src="/placeholder.svg?height=600&width=800"
                alt="AI automation interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Trusted by Innovative Teams</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Cyqle has transformed how our support team assists customers. We've reduced resolution times by 40%.",
                author: "Sarah Johnson",
                role: "Head of Customer Success, TechCorp",
              },
              {
                quote:
                  "The AI automation capabilities have saved our QA team countless hours of repetitive testing. Game changer!",
                author: "Michael Chen",
                role: "QA Lead, InnovateSoft",
              },
              {
                quote:
                  "Our development and operations teams now work in perfect sync thanks to Cyqle's collaborative environment.",
                author: "Alex Rodriguez",
                role: "CTO, FutureTech",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
              >
                <p className="text-white dark:text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-gray-100 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="relative z-10 py-20 bg-gradient-to-r from-purple-900/30 to-cyan-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Team's Workflow?</h2>
          <p className="text-xl dark:text-gray-300 text-white max-w-3xl mx-auto mb-10">
            Join the growing number of teams using Cyqle to collaborate, automate, and innovate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
            >
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="border-gray-700 hover:bg-gray-800 hover:text-gray-100">
              Schedule Demo
            </Button>
          </div>
          <div className="mt-10 flex items-center justify-center">
            <Lock className="h-5 w-5 dark:text-gray-400 text-gray-600 mr-2" />
            <p className="dark:text-gray-400 text-gray-600">14-day free trial. No credit card required.</p>
          </div>
        </div>
      </AnimatedSection>

      <Footer />
    </div>
  )
}

