import React, { useState, useRef } from "react";
import Particles from "../components/Particles";
import VariableProximity from "../components/VariableProximity";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function GetStarted() {
  const containerRef = useRef(null);
  const [smm, getSmm] = useState("SupaMessManager");
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "100vh", position: "relative" }}>
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
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <VariableProximity
          label="WELCOME TO"
          className="variable-proximity-demo"
          fromFontVariationSettings="'wght' 400, 'opsz' 9"
          toFontVariationSettings="'wght' 1000, 'opsz' 40"
          containerRef={containerRef}
          radius={200}
          falloff="linear"
        />
        <span
          style={{
            color: "#FF8800",
            fontFamily: '"Roboto Flex", sans-serif',
            fontSize: "3rem",
            fontWeight: 700,
          }}
        >
          {smm}
        </span>
      </div>
      <button
        type="button"
        onClick={() => navigate("/role")}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1.8rem",
          fontWeight: 600,
          borderRadius: "0.75rem",
          backgroundColor: "#FF8800",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          position: "absolute",
          top: "400px",
          left: "500px",
        }}
      >
        Get Started
      </button>
    </>
  );
}

export default GetStarted;
