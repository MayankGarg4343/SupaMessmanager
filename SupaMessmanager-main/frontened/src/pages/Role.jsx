import React from "react";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import { OrbitingCircles } from "../components/OrbitingCircles";
import { OrbitingCircless } from "../components/OrbitingCircless";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { GraduationCap, ShieldAlert, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Role() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* Background Particles & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles
          particleColors={["#f97316", "#ffffff"]}
          particleCount={60}
          particleSpread={8}
          speed={0.1}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 blur-[100px] pointer-events-none animate-pulse-glow" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow container mx-auto px-6 md:px-12 py-32 flex flex-col items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full max-w-5xl">
          
          {/* Left Column: Orbits and Fun Details */}
          <div className="hidden lg:flex relative items-center justify-center w-[400px] h-[400px] mx-auto">
            <div className="w-28 h-28 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-6xl shadow-xl z-20">
              🧑‍🍳
            </div>

            {/* Orbiting Circles */}
            {/* Inner Ring (Clockwise, 20s) */}
            <OrbitingCircles radius={-120} duration={20} reverse={false}>
              <div className="text-4xl filter drop-shadow-md select-none">🍔</div>
            </OrbitingCircles>

            <OrbitingCircles radius={120} duration={20} reverse={false}>
              <div className="text-4xl filter drop-shadow-md select-none">🍕</div>
            </OrbitingCircles>

            <OrbitingCircless radius={120} duration={20} reverse={false}>
              <div className="text-4xl filter drop-shadow-md select-none">🍉</div>
            </OrbitingCircless>

            <OrbitingCircless radius={-120} duration={20} reverse={false}>
              <div className="text-4xl filter drop-shadow-md select-none">🍒</div>
            </OrbitingCircless>

            {/* Outer Ring (Counter-Clockwise, 30s) */}
            <OrbitingCircles radius={-200} duration={30} reverse={true}>
              <div className="text-4xl filter drop-shadow-md select-none">🥗</div>
            </OrbitingCircles>

            <OrbitingCircles radius={200} duration={30} reverse={true}>
              <div className="text-4xl filter drop-shadow-md select-none">🍰</div>
            </OrbitingCircles>

            <OrbitingCircless radius={180} duration={30} reverse={true}>
              <div className="text-4xl filter drop-shadow-md select-none">🥤</div>
            </OrbitingCircless>

            <OrbitingCircless radius={-180} duration={30} reverse={true}>
              <div className="text-4xl filter drop-shadow-md select-none">🍑</div>
            </OrbitingCircless>
          </div>

          {/* Right Column: Role Picker Options */}
          <div className="space-y-8 max-w-lg mx-auto lg:mx-0">
            <div className="space-y-3 text-center lg:text-left">
              <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full w-fit">
                Identity Selection
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                Select Your Role
              </h1>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                Choose your portal below to sign in or get registered with the MessMate operations desk.
              </p>
            </div>

            {/* Option Cards */}
            <div className="grid grid-cols-1 gap-4">
              
              {/* Student Portal Card */}
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Card 
                  onClick={() => navigate("/login")}
                  className="group cursor-pointer border border-border/40 hover:border-primary/40 bg-card/40 hover:bg-muted/10 transition-all duration-300 select-none p-5"
                >
                  <CardContent className="flex items-center gap-4 p-0">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-orange-500/10 border border-orange-500/10 group-hover:bg-primary/20 transition-all text-orange-500">
                      <GraduationCap size={24} />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-1.5">
                        Student Portal
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Book meals, view today's daily menu, submit feedback, or lodge service tickets.
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Admin Portal Card */}
              <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                <Card 
                  onClick={() => navigate("/adminDashboard")}
                  className="group cursor-pointer border border-border/40 hover:border-primary/40 bg-card/40 hover:bg-muted/10 transition-all duration-300 select-none p-5"
                >
                  <CardContent className="flex items-center gap-4 p-0">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-amber-500/10 border border-amber-500/10 group-hover:bg-primary/20 transition-all text-amber-500">
                      <ShieldAlert size={24} />
                    </div>
                    <div className="flex-grow space-y-1">
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        Admin Desk
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Manage daily menus, track food analytics, resolve complaints, and view feedback queues.
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </div>

        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-6 border-t border-border/20 text-center text-xs text-muted-foreground relative z-10 bg-background/30 backdrop-blur-xs">
        &copy; {new Date().getFullYear()} MessMate Dining Operations. All Rights Reserved.
      </footer>
    </div>
  );
}
