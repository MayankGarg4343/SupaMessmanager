import React, { useState } from "react";
import PixelBlast from "../components/PixelBlast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { showToast } from "../utils/toast";
import { API_URL } from "../config";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { KeyRound, Mail, Loader2, ArrowLeft } from "lucide-react";
import { useTheme } from "../utils/ThemeContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (response.data.success) {
        // Stores the student and JWT token returned from the backend
        localStorage.setItem("student", JSON.stringify(response.data.student));
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        }
        showToast.success("Login successful! Redirecting to dashboard.");
        navigate("/dashboard");
      } else {
        showToast.error(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center p-6 transition-colors duration-300">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color={theme === "dark" ? "#f97316" : "#2563eb"}
          patternScale={8}
          patternDensity={1.0}
          pixelSizeJitter={0.4}
          enableRipples
          rippleSpeed={0.3}
          rippleThickness={0.1}
          rippleIntensityScale={1.2}
          liquid
          liquidStrength={0.08}
          liquidRadius={1.0}
          liquidWobbleSpeed={4}
          speed={0.4}
          edgeFade={0.3}
          transparent
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            background: "transparent",
          }}
        />
        {/* Glow helper */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none animate-pulse-glow" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Back navigation */}
        <button 
          onClick={() => navigate("/role")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors group cursor-pointer"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to roles
        </button>

        <Card className="border border-border/40 bg-card/45 backdrop-blur-lg shadow-2xl p-6">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <span className="text-2xl font-black tracking-tight text-foreground select-none">
                Mess<span className="text-primary">Mate</span>
              </span>
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight">Welcome Back</CardTitle>
            <CardDescription className="text-sm">Sign in to your Student Portal account</CardDescription>
          </CardHeader>
          
          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <KeyRound size={12} /> Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full font-bold mt-4">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> Signing In...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-bold transition-all ml-1">
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
