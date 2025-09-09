import React, { useState, useEffect } from "react";

// --- The base URL for your backend API
const API_URL = "http://localhost:5000/api";

// --- Page Components ---

const DashboardPage = ({ currentPage, onSetPage, menuData }) => {
  const [data, setData] = useState({
    totalStudents: null,
    activeComplaints: null,
    feedbackReceived: null,
    mealsBookedToday: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const [studentsRes, complaintsRes, feedbacksRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/students`),
          fetch(`${API_URL}/complaints`),
          fetch(`${API_URL}/feedback`),
          fetch(`${API_URL}/bookings/today`)
        ]);

        const students = studentsRes.ok ? await studentsRes.json() : [];
        const complaints = complaintsRes.ok ? await complaintsRes.json() : [];
        const feedbacks = feedbacksRes.ok ? await feedbacksRes.json() : [];
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        setData({
          totalStudents: students.length,
          activeComplaints: complaints.filter(c => c.status === 'Pending').length,
          feedbackReceived: feedbacks.length,
          mealsBookedToday: bookings.reduce((sum, booking) => sum + booking.meals.length, 0)
        });
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error("Dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummaryData();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <>
      <header className="topbar">
        <h1>Welcome, Admin 👋</h1>
        <button className="logout-btn">Logout</button>
      </header>
      <section className="cards">
        <div className="card">
          <h3>Total Students</h3>
          <p>{data.totalStudents}</p>
        </div>
        <div className="card">
          <h3>Active Complaints</h3>
          <p>{data.activeComplaints}</p>
        </div>
        <div className="card">
          <h3>Feedback Received</h3>
          <p>{data.feedbackReceived}</p>
        </div>
        <div className="card">
          <h3>Meals Booked Today</h3>
          <p>{data.mealsBookedToday}</p>
        </div>
      </section>

      <section className="analytics-section">
        <div className="analytics-card chart-card">
          <h2>Latest Menu</h2>
          {menuData ? (
            <div className="menu-display-card">
              <h3>{menuData.date ? new Date(menuData.date).toDateString() : 'No date'}</h3>
              <p>🍲 **Breakfast:** {menuData.breakfast || 'N/A'}</p>
              <p>🍛 **Lunch:** {menuData.lunch || 'N/A'}</p>
              <p>🍽️ **Dinner:** {menuData.dinner || 'N/A'}</p>
            </div>
          ) : (
            <div className="chart-placeholder">
              <p>No menu data available for today.</p>
            </div>
          )}
        </div>
        <div className="analytics-card recent-updates-card">
          <h2>Recent Updates</h2>
          <ul className="updates-list">
            <li>Menu updated: Paneer Curry for dinner</li>
            <li>Complaint #102 resolved</li>
            <li>12 new feedback entries</li>
            <li>30 new students registered</li>
          </ul>
        </div>
      </section>
    </>
  );
};

const ManageMenu = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [breakfast, setBreakfast] = useState('');
  const [lunch, setLunch] = useState('');
  const [dinner, setDinner] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMenu = async (selectedDate) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/menu/${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        setBreakfast(data.breakfast || '');
        setLunch(data.lunch || '');
        setDinner(data.dinner || '');
      } else {
        setBreakfast('');
        setLunch('');
        setDinner('');
        setMessage("No menu found for this date. You can create one.");
      }
    } catch (err) {
      console.error("Failed to fetch menu:", err);
      setMessage("Failed to load menu data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu(date);
  }, [date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, breakfast, lunch, dinner }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Menu updated successfully!");
      } else {
        throw new Error(data.message || "Failed to update menu.");
      }
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="menu">🍔</span> Manage Menu</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <label>
          Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>
        <label>
          Breakfast:
          <input type="text" value={breakfast} onChange={(e) => setBreakfast(e.target.value)} required />
        </label>
        <label>
          Lunch:
          <input type="text" value={lunch} onChange={(e) => setLunch(e.target.value)} required />
        </label>
        <label>
          Dinner:
          <input type="text" value={dinner} onChange={(e) => setDinner(e.target.value)} required />
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Updating..." : "Update Menu"}
        </button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

const MealBookings = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="bookings">🗓️</span> Meal Bookings</h1>
    <div className="page-placeholder">Table of meal bookings will be displayed here.</div>
  </div>
);

const Feedback = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="feedback">⭐</span> Feedback</h1>
    <div className="page-placeholder">Table of all feedback entries will be displayed here.</div>
  </div>
);

const Complaints = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="complaints">⚠️</span> Complaints</h1>
    <div className="page-placeholder">List of all complaints with their statuses.</div>
  </div>
);

const Analytics = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="analytics">📊</span> Analytics</h1>
    <div className="page-placeholder">Analytics charts and reports will be displayed here.</div>
  </div>
);

const UserManagement = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="users">👨‍💼</span> User Management</h1>
    <div className="page-placeholder">Admin can manage student accounts here.</div>
  </div>
);

const Settings = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="settings">⚙️</span> Settings</h1>
    <div className="page-placeholder">Admin settings and configuration options.</div>
  </div>
);

// --- Main App Component ---

function ADashboard() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [menuData, setMenuData] = useState(null);

  useEffect(() => {
    // Fetch menu data for today on initial load and whenever the page changes to Dashboard
    const fetchTodayMenu = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch(`${API_URL}/menu/${today}`);
        if (res.ok) {
          const data = await res.json();
          setMenuData(data);
        } else {
          setMenuData(null);
        }
      } catch (err) {
        console.error("Failed to fetch today's menu:", err);
        setMenuData(null);
      }
    };

    if (currentPage === 'Dashboard') {
      fetchTodayMenu();
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage menuData={menuData} />;
      case 'Manage Menu':
        return <ManageMenu />;
      case 'Meal Bookings':
        return <MealBookings />;
      case 'Feedback':
        return <Feedback />;
      case 'Complaints':
        return <Complaints />;
      case 'Analytics':
        return <Analytics />;
      case 'User Management':
        return <UserManagement />;
      case 'Settings':
        return <Settings />;
      default:
        return <DashboardPage menuData={menuData} />;
    }
  };

  return (
    <>
      <style>
        {`
          /* Admin Dashboard Layout */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          .admin-dashboard {
            display: flex;
            background: #0d0d0d;
            color: #fff;
            min-height: 100vh;
            font-family: "Poppins", sans-serif;
          }

          /* Sidebar */
          .sidebar {
            width: 230px;
            background: #1a1a1a;
            color: #ff8800;
            padding: 2rem 1rem;
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
          }

          .sidebar .logo {
            font-size: 1.6rem;
            font-weight: bold;
            text-align: center;
            margin-bottom: 2rem;
          }

          .sidebar .menu {
            list-style: none;
            padding: 0;
          }

          .sidebar .menu li {
            padding: 0.8rem 1rem;
            margin-bottom: 0.6rem;
            border-radius: 6px;
            cursor: pointer;
            transition: background 0.3s;
          }

          .sidebar .menu li:hover,
          .sidebar .menu li.active {
            background: #ff8800;
            color: #000;
          }

          /* Main Content */
          .main-content {
            margin-left: 230px;
            flex: 1;
            padding: 2rem;
          }

          /* Topbar */
          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
          }

          .logout-btn {
            background: #e74c3c;
            border: none;
            color: #fff;
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
          }

          .logout-btn:hover {
            background: #c0392b;
          }

          /* Cards */
          .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
          }

          .card {
            background: #1f1f1f;
            border: 1px solid #ff8800;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            transition: 0.3s;
          }

          .card:hover {
            background: #ff8800;
            color: #000;
          }
          .card:hover h3 {
            color: #000;
          }

          /* Analytics */
          .analytics-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 20px;
            margin-top: 30px;
          }

          .analytics-card {
            background-color: #1f1f1f;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }

          .chart-card {
            border: 1px dashed #ff8800;
            text-align: center;
          }

          .chart-placeholder {
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #1a1a1a;
            border-radius: 8px;
            border: 1px dashed #ccc;
            color: #777;
          }

          .recent-updates-card h2 {
            margin-top: 0;
            font-size: 1.5rem;
            color: #ffa533;
            border-bottom: 2px solid #ff8800;
            padding-bottom: 10px;
          }

          .updates-list {
            list-style: none;
            padding: 0;
          }

          .updates-list li {
            background-color: #1a1a1a;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid #ff8800;
            transition: transform 0.2s ease;
          }

          .updates-list li:hover {
            transform: translateX(5px);
          }

          /* Common Page Styles */
          .page-content {
            background-color: #1f1f1f;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
          .page-content h1 {
            font-size: 2rem;
            margin-top: 0;
            margin-bottom: 20px;
            color: #ff8800;
            display: flex;
            align-items: center;
            gap: 15px;
            border-bottom: 2px solid #ff8800;
            padding-bottom: 10px;
          }

          .page-placeholder {
            margin-top: 30px;
            padding: 50px;
            border: 2px dashed #ff8800;
            border-radius: 10px;
            text-align: center;
            color: #888;
            background-color: #1a1a1a;
          }

          .form-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .form-container label {
            display: flex;
            flex-direction: column;
            color: #ff8800;
            font-weight: bold;
          }

          .form-container input, .form-container textarea {
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid #ff8800;
            background-color: #1a1a1a;
            color: #fff;
          }

          .btn {
            background: #ff8800;
            border: none;
            color: #000;
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
            margin-top: 10px;
          }

          .btn:hover {
            background: #ffa533;
          }

          .status-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            background: #ff8800;
            color: #0d0d0d;
            font-weight: bold;
          }

          .menu-display-card {
            background-color: #1a1a1a;
            border: 1px solid #ff8800;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: left;
          }
          .menu-display-card h3 {
            color: #ff8800;
          }
        `}
      </style>
      <div className="admin-dashboard">
        <aside className="sidebar">
          <h2 className="logo">MessMate Admin</h2>
          <ul className="menu">
            <li className={currentPage === 'Dashboard' ? 'active' : ''} onClick={() => setCurrentPage('Dashboard')}>Dashboard</li>
            <li className={currentPage === 'Manage Menu' ? 'active' : ''} onClick={() => setCurrentPage('Manage Menu')}>Manage Menu</li>
            <li className={currentPage === 'Meal Bookings' ? 'active' : ''} onClick={() => setCurrentPage('Meal Bookings')}>Meal Bookings</li>
            <li className={currentPage === 'Feedback' ? 'active' : ''} onClick={() => setCurrentPage('Feedback')}>Feedback</li>
            <li className={currentPage === 'Complaints' ? 'active' : ''} onClick={() => setCurrentPage('Complaints')}>Complaints</li>
            <li className={currentPage === 'Analytics' ? 'active' : ''} onClick={() => setCurrentPage('Analytics')}>Analytics</li>
            <li className={currentPage === 'User Management' ? 'active' : ''} onClick={() => setCurrentPage('User Management')}>User Management</li>
            <li className={currentPage === 'Settings' ? 'active' : ''} onClick={() => setCurrentPage('Settings')}>Settings</li>
          </ul>
        </aside>
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default ADashboard;
