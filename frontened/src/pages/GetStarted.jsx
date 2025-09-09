import React, { useState, useRef } from "react";
import Particles from "../components/Particles";
import VariableProximity from "../components/VariableProximity";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import CircularGallery from "../components/CircularGallery";
import "../components/GetStarted.css"; // import css file

function GetStarted() {
  const containerRef = useRef(null);
  const [smm] = useState("MessMate");
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* 🔹 Particles fixed as background */}
      <div className="particles-background">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* 🔹 Hero Section */}
      <div ref={containerRef} className="hero-section">
        <div className="welcome-container">
          <VariableProximity
            label="WELCOME TO"
            className="variable-proximity-demo"
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={200}
            falloff="linear"
          />
          <span className="hero-title">{smm}</span>
        </div>

        {/* Get Started Button */}
        <button
          type="button"
          onClick={() => navigate("/role")}
          className="get-started-btn"
        >
          Get Started
        </button>

        {/* 🔹 Extra Line Section (with heading) */}
        <div className="explore-section">
          <h2 className="explore-heading">Explore MessMate</h2>
          <p className="explore-text">
            Discover how we make your hostel and mess experience smarter,
            simpler, and more connected.
          </p>
        </div>
      </div>

      {/* 🔹 Circular Gallery Section */}
      <div className="student">
        {/* Heading */}
        <div className="student-heading">
          <h1>
            G<span style={{ color: "white" }}>E</span>T{" "}
            <span style={{ color: "white" }}>Y</span>O
            <span style={{ color: "white" }}>U</span>R{" "}
            <span style={{ color: "white" }}>M</span>E
            <span style={{ color: "white" }}>A</span>L{" "}
            <span style={{ color: "white" }}>I</span>N
            <span style={{ color: "white" }}>F</span>O
          </h1>
        </div>

        {/* Full-width Circular Gallery */}
        <div className="gallery-wrapper">
          <CircularGallery
            bend={30}
            textColor="#ffffff"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>Mess Management System</h2>
            <p>
              A smart solution to simplify dining operations, reduce food
              wastage, and improve the overall student experience. Our
              technology-driven approach ensures transparency and efficiency.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/faq">FAQs</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Our Services</h3>
            <ul>
              <li>
                <a href="#">Daily Menu Management</a>
              </li>
              <li>
                <a href="#">Student Feedback System</a>
              </li>
              <li>
                <a href="#">Analytics Dashboard</a>
              </li>
              <li>
                <a href="#">Complaint Handling</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@messmanager.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Chitkara University, Punjab</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Mess Management System. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

export default GetStarted;
