import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { showToast } from "../utils/toast";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { API_URL } from "../config";
import { motion } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        showToast.success("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        showToast.error("Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      showToast.error("Error connecting to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col justify-between overflow-x-hidden">
      <Navbar />

      {/* Background Particles & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Particles
          particleColors={["#f97316", "#ffffff", "#f59e0b"]}
          particleCount={50}
          particleSpread={6}
          speed={0.12}
          particleBaseSize={80}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-pulse-glow" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-grow pt-32 pb-16 flex items-center justify-center">
        <div className="container mx-auto px-6 md:px-12 w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            
            {/* Left Column: Contact info */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-8 py-2">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4 text-center lg:text-left"
              >
                <span className="text-xs font-bold tracking-wider text-primary uppercase bg-primary/10 px-3 py-1 rounded-full w-fit">
                  Get In Touch
                </span>
                
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                  Contact Our Desk
                </h1>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Have questions about menu scheduling, hostel integrations, operational metrics, or feedback channels? Reach out, and we will get back to you shortly.
                </p>
              </motion.div>

              {/* Informative coordinates cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-xs select-none">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 text-primary">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</h4>
                    <p className="text-sm font-semibold text-foreground mt-0.5">support@messmate.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-xs select-none">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 text-primary">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Hotline</h4>
                    <p className="text-sm font-semibold text-foreground mt-0.5">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-xs select-none">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 text-primary">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Office Location</h4>
                    <p className="text-sm font-semibold text-foreground mt-0.5">Chitkara University, Punjab</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card/20 backdrop-blur-xs select-none">
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/10 text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Desk Hours</h4>
                    <p className="text-sm font-semibold text-foreground mt-0.5">Monday – Friday: 9:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Form Panel */}
            <div className="lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full"
              >
                <Card className="border border-border/40 bg-card/25 backdrop-blur-md p-8 md:p-10 shadow-xl select-none h-full flex flex-col justify-between">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                        <MessageSquare size={22} className="text-primary" /> Send a Message
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Fill in the details below, and our administrative desk will respond to your email.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Full Name
                        </label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="email" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                          Email Address
                        </label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Phone Number (Optional)
                      </label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 99999 99999"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="subject" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Subject
                      </label>
                      <Input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="message" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        Message Details
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Provide details about your query..."
                        required
                        className="min-h-[120px]"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 font-bold cursor-pointer"
                      >
                        {isSubmitting ? "Sending..." : "Send Message"} <Send size={16} />
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            </div>

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

export default ContactUs;
