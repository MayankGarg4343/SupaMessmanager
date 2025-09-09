import React from "react";
import "../components/ADashboard.css";

function ADashboard() {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2 className="logo">⚙️ Admin</h2>
        <ul className="menu">
          <li className="active">📊 Dashboard</li>
          <li>📄 Documents</li>
          <li>📚 Resources</li>
          <li>📢 Complaints</li>
          <li>👥 User Management</li>
          <li>✅ Verification</li>
          <li>📈 Analytics</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <input type="text" placeholder="Search..." className="search-bar" />
          <div className="topbar-actions">
            <span className="notif">🔔</span>
            <span className="profile">👤 Admin</span>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="summary-cards">
          <div className="card">
            <h3>Total Students</h3>
            <p>1,245</p>
          </div>
          <div className="card">
            <h3>Active Complaints</h3>
            <p>12</p>
          </div>
          <div className="card">
            <h3>Documents Verified</h3>
            <p>327</p>
          </div>
          <div className="card">
            <h3>Pending Requests</h3>
            <p>45</p>
          </div>
        </section>

        {/* Analytics Section */}
        <section className="charts">
          <h2>Analytics Overview</h2>
          <div className="chart-placeholder">📊 Chart 1</div>
          <div className="chart-placeholder">📈 Chart 2</div>
        </section>

        {/* Recent Activity */}
        <section className="activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>✅ User <strong>Ravi</strong> verified documents</li>
            <li>📢 Complaint resolved by admin</li>
            <li>📝 Feedback reviewed</li>
            <li>👥 New student registered</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default ADashboard;
