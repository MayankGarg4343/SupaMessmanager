import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
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
          ? "bg-white/30 backdrop-blur-md shadow-md"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <div className="text-4xl font-bold tracking-wide text-white">
          Mess<span style={{color:"orange"}}>Mate</span>
        </div>

        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <a
            href="/about"
            className="px-4 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition"
          >
            About Us
          </a>
          <a
            href="/contact"
            className="px-4 py-2 rounded-xl bg-orange-600 text-white font-medium hover:bg-orange-500 transition"
          >
            Contact Us
          </a>
        </div>
        <button className="md:hidden text-white" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-green-950 px-6 py-3 space-y-3 text-sm">
          <a href="/" className="block text-white hover:text-orange-400">
            Dashboard
          </a>
          <a href="/menu" className="block text-white hover:text-orange-400">
            Menu
          </a>
          <a href="/students" className="block text-white hover:text-orange-400">
            Students
          </a>
          <a href="/payments" className="block text-white hover:text-orange-400">
            Payments
          </a>
          <a href="/feedback" className="block text-white hover:text-orange-400">
            Feedback
          </a>
          <a href="/contact" className="block text-white hover:text-orange-400">
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
