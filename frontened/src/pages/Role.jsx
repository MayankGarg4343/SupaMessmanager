import React from "react";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import { OrbitingCircles } from "../components/OrbitingCircles";
import { useNavigate } from "react-router-dom";

function Role() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div style={{ width: "100%", height: "100px", position: "relative" }}>
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
      <div className="relative w-[400px] h-[400px] flex items-center justify-center z-10 ml-190 mt-10">
  <div className="w-24 h-24 flex items-center justify-center text-8xl font-bold">
    🧑‍🍳
  </div>

  {/* Inner Orbit (radius 110px, faster) */}
<OrbitingCircles radius={110} duration={6}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍔</div>
</OrbitingCircles>

<OrbitingCircles radius={110} duration={8}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🥗</div>
</OrbitingCircles>

<OrbitingCircles radius={110} duration={10}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍕</div>
</OrbitingCircles>

<OrbitingCircles radius={110} duration={12}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🥤</div>
</OrbitingCircles>

{/* Outer Orbit (radius 210px, slower) */}
<OrbitingCircles radius={210} duration={12}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍉</div>
</OrbitingCircles>

<OrbitingCircles radius={210} duration={14}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍒</div>
</OrbitingCircles>

<OrbitingCircles radius={210} duration={16}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍑</div>
</OrbitingCircles>

<OrbitingCircles radius={210} duration={18}>
  <div className="w-22 h-22 flex items-center justify-center text-6xl">🍰</div>
</OrbitingCircles>

</div>

      <div className="absolute inset-0 flex flex-col items-start justify-center text-white ml-10">
        <h1 className="text-xl md:text-6xl font-bold mb-6 tracking-wide">
          SELECT YOUR ROLE
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition duration-300"
          onClick={() => navigate("/login")}>
            Student
          </button>
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition duration-300">
            Admin
          </button>
        </div>
      </div>
    </>
  );
}

export default Role;
