import React from "react";
import "../components/SDashboard.css";
import { useNavigate } from "react-router-dom";

function SDashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🍴 MessMate</h2>
        <ul className="menu">
          <li className="active">🏠 Dashboard</li>
          <li>📅 Today&apos;s Menu</li>
          <li>✅ Meal Booking</li>
          <li onClick={() => navigate("/feedback")}>📝 Feedback</li>
          <li>📢 Complaints</li>
          <li>📊 Analytics</li>
          <li>👤 Profile</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1>Welcome, Student 👋</h1>
          <button className="logout-btn">Logout</button>
        </header>

        {/* Cards Section */}
        <section className="cards">
          <div className="card highlight">
            <h3>Today&apos;s Menu</h3>
            <p>
              🍲 <strong>Breakfast:</strong> Poha, Tea <br />
              🍛 <strong>Lunch:</strong> Rajma Chawal <br />
              🍽 <strong>Dinner:</strong> Paneer Curry
            </p>
          </div>

          <div className="card">
            <h3>Meal Booking</h3>
            <p>
              You have booked <strong>Lunch & Dinner</strong> today.
            </p>
            <button className="btn">Manage Meals</button>
          </div>

          <div className="card">
            <h3>Notices</h3>
            <p>📢 Pizza Night this Saturday! 🍕</p>
          </div>

          <div className="card">
            <h3>Feedback</h3>
            <p>Help us improve your dining experience.</p>
            <button className="btn" onClick={() => navigate("/feedback")}>
              Give Feedback
            </button>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="analytics">
          <h2>Your Stats</h2>
          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>Meals Taken</h3>
              <p>72 this month</p>
            </div>
            <div className="analytics-card">
              <h3>Food Saved</h3>
              <p>5 kg avoided</p>
            </div>
            <div className="analytics-card">
              <h3>Complaints Resolved</h3>
              <p>3 resolved</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SDashboard;
