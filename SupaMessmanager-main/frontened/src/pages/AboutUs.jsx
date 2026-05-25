import React from "react";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Target, Sparkles, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const AboutUs = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* Background Particles & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles
          particleColors={["#f97316", "#ffffff", "#f59e0b"]}
          particleCount={60}
          particleSpread={6}
          speed={0.12}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow pt-32 pb-16">
        
        {/* Hero Section */}
        <div className="container mx-auto px-6 md:px-12 text-center max-w-4xl mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-wider uppercase mb-3">
              📖 Our Journey & Purpose
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              About <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent select-none">MessMate</span>
            </h1>
            
            <p className="mt-6 text-base md:text-lg text-muted-foreground leading-relaxed max-w-3xl">
              Our <span className="text-foreground font-semibold">Mess Management System</span> is built to simplify dining operations, reduce food wastage, and ensure a seamless experience for both students and mess managers. By combining sleek modern web design with robust logistics, we reshape campus dining.
            </p>
          </motion.div>
        </div>

        {/* Pillars (Mission, Vision, Values) */}
        <div className="container mx-auto px-6 md:px-12 max-w-6xl mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full border border-border/40 hover:border-primary/30 transition-all duration-300 bg-card/20 backdrop-blur-xs select-none">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                  <div className="p-4 rounded-full bg-primary/15 border border-primary/20 text-primary">
                    <Target size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    To provide a transparent and efficient mess ecosystem where students can access menus and give feedback in real-time, helping managers optimize resources.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="h-full border border-border/40 hover:border-primary/30 transition-all duration-300 bg-card/20 backdrop-blur-xs select-none">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                  <div className="p-4 rounded-full bg-primary/15 border border-primary/20 text-primary">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    We aim to create smart, sustainable, and student-first dining environments by combining state-of-the-art web technology with daily mess workflows.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Values Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full border border-border/40 hover:border-primary/30 transition-all duration-300 bg-card/20 backdrop-blur-xs select-none">
                <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
                  <div className="p-4 rounded-full bg-primary/15 border border-primary/20 text-primary">
                    <Heart size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Our Values</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Efficiency, transparency, and satisfaction drive us. Every meal counts, food waste is minimized, and student feedback is addressed immediately.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Who We Are & Key Features split content section */}
        <div className="border-y border-border/40 bg-muted/5 py-20 mb-24">
          <div className="container mx-auto px-6 md:px-12 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                  About The Team
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Who We Are
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  We are a group of passionate developers, students, and campus coordinators who recognized the daily operational challenges in dining halls. From menu coordination to food waste tracking and student feedback loops, our goal is to modernize the dining experience, rendering manual queues obsolete.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
                  Modern Capabilities
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                  Key Features
                </h2>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  Our system offers real-time digital menus, digital booking toggles (breakfast, lunch, dinner), detailed dining metrics, structured feedback logs, administrative complaint queues, and data-driven analytics charts. We combine premium visuals with responsive features.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Call to Action Commitment Box */}
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel border border-primary/20 bg-primary/5 rounded-3xl p-10 md:p-14 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 rounded-full bg-primary/5 blur-[50px] pointer-events-none" />
            
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Redefining Student Dining</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">Our Commitment</h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              We are committed to building a future where university mess operations are smart, sustainable, and student-first. Together, let's make daily dining simple.
            </p>
            
            <div className="pt-4 flex justify-center">
              <a href="/role">
                <Button size="lg" className="flex items-center gap-2 font-bold cursor-pointer">
                  Get Started Now <ArrowRight size={18} />
                </Button>
              </a>
            </div>
          </motion.div>
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
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Daily Menu Scheduling</li>
                <li>Student Feedback Portals</li>
                <li>Resource Optimization</li>
                <li>Ticket Resolution Queues</li>
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
};

export default AboutUs;
