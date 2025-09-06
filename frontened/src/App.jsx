import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import GetStarted from "./pages/GetStarted";
import Role from "./pages/Role";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/role" element={<Role />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs/>}/>
      </Routes>
    </Router>
  );
}

export default App;
