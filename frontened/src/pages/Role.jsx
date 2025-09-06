import React from "react";
import Navbar from "../components/Navbar";
import Particles from "../components/Particles";
import CardSwap, { Card } from "../components/CardSwap";

function Role() {
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

      <div style={{ height: "500px", position: "relative" }}>
        <CardSwap
          cardDistance={60}
          verticalDistance={70}
          delay={5000}
          pauseOnHover={false}
        >
          <Card>
            <h1
              style={{
                color: "orange",
                fontSize: "1.8rem",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Student Portal
            </h1>
            <img
              src="https://plus.unsplash.com/premium_photo-1681248156367-d95876bf885d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHN0dWRlbnR8ZW58MHx8MHx8fDA%3D"
              alt="Student Portal"
              style={{
                borderRadius: "10px",
                marginBottom: "12px",
                width: "100%",
                height: "170px", 
                objectFit: "cover",
              }}
            />
            <p style={{ color: "#ddd", fontSize: "1.1rem", lineHeight: "1.6" }}>
              Students can easily check daily menus, pre-book meals, and give
              feedback to ensure better food quality and service.
            </p>
          </Card>

          <Card>
            <h2
              style={{
                color: "orange",
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Mess Manager
            </h2>
            <img
              src="https://images.unsplash.com/photo-1576867804947-68005b1f764e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Zm9vZCUyMG1lc3MlMjBtYW5hZ2VyfGVufDB8fDB8fHww"
              alt="Mess Manager"
              style={{
                borderRadius: "10px",
                marginBottom: "12px",
                width: "100%",
                height: "170px",
                objectFit: "cover",
              }}
            />
            <p style={{ color: "#ddd", fontSize: "1.1rem", lineHeight: "1.6" }}>
              Managers can plan menus, track inventory, and resolve student
              complaints efficiently, ensuring smooth daily operations.
            </p>
          </Card>

          <Card>
            <h2
              style={{
                color: "orange",
                fontSize: "1.6rem",
                fontWeight: "bold",
                marginBottom: "15px",
              }}
            >
              Analytics Dashboard
            </h2>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8QkhibTVOVEZ0Yjh8fGVufDB8fHx8fA%3D%3D%2C%5Bobject+Object%5D"
              alt="Analytics Dashboard"
              style={{
                borderRadius: "10px",
                marginBottom: "12px",
                width: "100%",
                height: "170px",
                objectFit: "cover",
              }}
            />
            <p style={{ color: "#ddd", fontSize: "1.1rem", lineHeight: "1.6" }}>
              Gain insights into food consumption, student preferences, and
              budget reports to reduce waste and improve service quality.
            </p>
          </Card>
        </CardSwap>
      </div>

      <div className="absolute inset-0 flex flex-col items-start justify-center text-white ml-10">
        <h1 className="text-xl md:text-6xl font-bold mb-6 tracking-wide">
          SELECT YOUR ROLE
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition duration-300">
            Student
          </button>
          <button className="px-6 py-3 rounded-xl bg-orange-600 text-white hover:bg-orange-500 transition duration-300">
            Manager
          </button>
        </div>
      </div>
    </>
  );
}

export default Role;
