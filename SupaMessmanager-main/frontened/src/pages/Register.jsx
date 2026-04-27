import React, { useState } from "react";
import PixelBlast from "../components/PixelBlast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../utils/toast";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast.error("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password,
      });

      if (response.data.success) {
        showToast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        showToast.error(response.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          "Registration failed. Please try again.";
        showToast.error(errorMessage);
      } else if (error.request) {
        // Request was made but no response received
        showToast.error("No response from server. Please check your connection.");
      } else {
        // Something else happened
        showToast.error("Something went wrong. Try again!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PixelBlast
        variant="circle"
        pixelSize={10}
        color="white"
        patternScale={10}
        patternDensity={1.2}
        pixelSizeJitter={0.5}
        enableRipples
        rippleSpeed={0.4}
        rippleThickness={0.12}
        rippleIntensityScale={1.5}
        liquid
        liquidStrength={0.12}
        liquidRadius={1.2}
        liquidWobbleSpeed={5}
        speed={0.6}
        edgeFade={0.25}
        transparent
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
          background: "black",
        }}
      />
      <div className="contact-form">
        <h1>Student Registration</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password (min. 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="signup-link">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-orange-500 font-medium underline"
          >
            Login
          </button>
        </div>
      </div>
    </>
  );
}
