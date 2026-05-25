import React, { useRef } from "react";
import Particles from "../components/Particles";
import VariableProximity from "../components/VariableProximity";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import CircularGallery from "../components/CircularGallery";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Coffee, ClipboardList, AlertCircle, BarChart3, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function GetStarted() {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Coffee className="h-6 w-6 text-orange-500" />,
      title: "Daily Menu Management",
      desc: "Instant access to real-time menu updates. Plan your meals with high-resolution menu schedules uploaded by mess administrators.",
    },
    {
      icon: <ClipboardList className="h-6 w-6 text-orange-500" />,
      title: "Smart Booking System",
      desc: "Book breakfasts, lunches, and dinners dynamically. Help prevent excessive cooking and reduce campus food waste.",
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-orange-500" />,
      title: "Complaint Resolution Queue",
      desc: "Encountering service bottlenecks? Submit instant complaints, check status in real-time, and get matters resolved efficiently.",
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-orange-500" />,
      title: "Advanced Data Analytics",
      desc: "Gain insight into your monthly consumption and metrics. Monitor resolved issues and see real-time food savings.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300">
      <Navbar />

      {/* Background canvas elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles
          particleColors={["#f97316", "#f59e0b", "#9ca3af"]}
          particleCount={80}
          particleSpread={6}
          speed={0.15}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        {/* Glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse-glow" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 pt-28">
        
        {/* Hero Section */}
        <div ref={containerRef} className="container mx-auto px-6 md:px-12 py-16 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-3">
              ✨ Redefining Student Dining
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 flex-wrap">
              <VariableProximity
                label="Welcome To"
                className="text-4xl md:text-7xl font-extrabold tracking-tight"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 800, 'opsz' 40"
                containerRef={containerRef}
                radius={160}
                falloff="linear"
              />
              <span className="text-4xl md:text-7xl font-extrabold tracking-tight bg-linear-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent ml-2 select-none">
                MessMate
              </span>
            </div>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              A premium, intelligent dining ecosystem designed to eliminate waste, streamline kitchen operations, and put student satisfaction first.
            </p>

            <div className="mt-8 flex items-center justify-center">
              <Button size="lg" className="flex items-center gap-2 font-bold" onClick={() => navigate("/role")}>
                Get Started <ChevronRight size={18} />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="container mx-auto px-6 md:px-12 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Everything You Need</h2>
            <p className="text-muted-foreground mt-2">Designed for elite visual consistency and exceptional user flow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="h-full border border-border/40 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="flex gap-4 p-6">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/10 h-fit">
                      {feature.icon}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3D Gallery Component Section */}
        <div className="border-t border-border/40 bg-muted/10 py-20 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl text-center mb-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground uppercase">
              Get Your Meal Info
            </h2>
            <p className="text-muted-foreground mt-2">
              Browse through our customizable high-quality menus and delicious selections.
            </p>
          </div>

          <div className="w-full h-[380px] md:h-[450px] relative flex justify-center items-center">
            <CircularGallery
              bend={20}
              textColor="var(--primary)"
              borderRadius={0.06}
              scrollEase={0.03}
            />
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/50 backdrop-blur-md relative z-10 py-16">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-1 md:col-span-1">
              <span className="text-xl font-bold tracking-tight text-foreground">
                Mess<span className="text-primary">Mate</span>
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Empowering university hostels with modern dining logistics, menu transparency, and waste-saving analytics.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</a></li>
                <li><a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Features</h4>
              <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground">Daily Menu Scheduling</span></li>
                <li><span className="text-muted-foreground">Student Feedback Portals</span></li>
                <li><span className="text-muted-foreground">Resource Optimization</span></li>
                <li><span className="text-muted-foreground">Ticket resolution queues</span></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact</h4>
              <p className="text-sm text-muted-foreground">Email: support@messmate.com</p>
              <p className="text-sm text-muted-foreground">Location: Chitkara University, Punjab</p>
              <div className="flex gap-4 pt-1 text-sm font-bold">
                <span className="text-primary hover:underline cursor-pointer">GitHub</span>
                <span className="text-primary hover:underline cursor-pointer">LinkedIn</span>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border/20 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} MessMate Dining Operations. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
