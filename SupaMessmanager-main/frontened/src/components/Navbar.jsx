import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../utils/ThemeContext";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 p-4 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 border-b border-border/40 backdrop-blur-lg shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-2">
        <a href="/" className="group flex items-center gap-1">
          <div className="text-2xl font-bold tracking-tight text-foreground select-none">
            Mess<span className="text-primary group-hover:text-primary/80 transition-colors">Mate</span>
          </div>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <a
            href="/about"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            Contact Us
          </a>

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border/40 hover:bg-muted/40 text-foreground transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <a href="/role">
            <Button size="sm">Get Started</Button>
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border/40 hover:bg-muted/40 text-foreground transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          
          <button className="text-foreground p-2 hover:bg-muted/40 rounded-xl" onClick={toggleMenu}>
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border/40 px-6 py-4 space-y-4 text-sm mt-4 rounded-2xl shadow-xl overflow-hidden"
          >
            <a href="/" className="block text-foreground font-semibold hover:text-primary transition-colors py-1">
              Home
            </a>
            <a href="/about" className="block text-foreground font-semibold hover:text-primary transition-colors py-1">
              About Us
            </a>
            <a href="/contact" className="block text-foreground font-semibold hover:text-primary transition-colors py-1">
              Contact Us
            </a>
            <div className="pt-2 border-t border-border/30">
              <a href="/role" onClick={() => setIsOpen(false)}>
                <Button size="sm" className="w-full">Get Started</Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
