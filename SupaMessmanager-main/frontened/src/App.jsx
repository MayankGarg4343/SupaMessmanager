import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "./pages/GetStarted";
import Role from "./pages/Role";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SDashboard from "./pages/SDashboard";
import FeedbackForm from "./components/FeedbackForm";
import ADashboard from "./pages/Adashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/role" element={<Role />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<SDashboard />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/adminDashboard" element={<ADashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
