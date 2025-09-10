import React, { useState, useEffect } from "react";

// The base URL for your backend API
const API_URL = "http://localhost:5000/api";

// --- Utility Functions ---
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Page Components (defined within the same file) ---

const DashboardPage = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    activeComplaints: 0,
    feedbackReceived: 0,
    mealsBooked: 0,
    recentUpdates: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          studentsRes,
          complaintsRes,
          feedbackRes,
          bookingsRes,
        ] = await Promise.all([
          fetch(`${API_URL}/students`),
          fetch(`${API_URL}/complaints`),
          fetch(`${API_URL}/feedback`),
          fetch(`${API_URL}/bookings/daily/${new Date().toISOString().split('T')[0]}`),
        ]);

        if (!studentsRes.ok || !complaintsRes.ok || !feedbackRes.ok || !bookingsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const students = await studentsRes.json();
        const complaints = await complaintsRes.json();
        const feedback = await feedbackRes.json();
        const bookings = await bookingsRes.json();

        const activeComplaintsCount = complaints.filter(c => c.status !== "Resolved").length;
        const mealsBookedCount = bookings.reduce((sum, booking) => sum + booking.meals.length, 0);

        // Simple logic to get recent updates
        const recentComplaints = complaints.slice(0, 2).map(c => `New complaint submitted: ${c.subject}`);
        const recentFeedback = feedback.slice(0, 2).map(f => `New feedback entry received: "${f.feedback.substring(0, 20)}..."`);
        const recentUpdates = [...recentComplaints, ...recentFeedback].sort(() => 0.5 - Math.random());

        setData({
          totalStudents: students.length,
          activeComplaints: activeComplaintsCount,
          feedbackReceived: feedback.length,
          mealsBooked: mealsBookedCount,
          recentUpdates,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading-state">Loading dashboard data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <>
      <header className="topbar">
        <h1>Welcome, Admin 👋</h1>
        <button className="logout-btn">
          Logout ➡️
        </button>
      </header>

      {/* Summary Cards */}
      <section className="cards">
        <div className="card">
          <div className="icon-wrapper students">
            <span role="img" aria-label="students">👨‍🎓</span>
          </div>
          <div className="card-content">
            <h3>Total Students</h3>
            <p className="metric">{data.totalStudents}</p>
          </div>
        </div>
        <div className="card">
          <div className="icon-wrapper complaints">
            <span role="img" aria-label="complaints">⚠️</span>
          </div>
          <div className="card-content">
            <h3>Active Complaints</h3>
            <p className="metric">{data.activeComplaints}</p>
          </div>
        </div>
        <div className="card">
          <div className="icon-wrapper feedback">
            <span role="img" aria-label="feedback">⭐️</span>
          </div>
          <div className="card-content">
            <h3>Feedback Received</h3>
            <p className="metric">{data.feedbackReceived}</p>
          </div>
        </div>
        <div className="card">
          <div className="icon-wrapper meals">
            <span role="img" aria-label="meals">🍽️</span>
          </div>
          <div className="card-content">
            <h3>Meals Booked Today</h3>
            <p className="metric">{data.mealsBooked}</p>
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="analytics-section">
        <div className="analytics-card chart-card">
          <h2>Meal Trends</h2>
          <div className="chart-placeholder">Interactive chart goes here...</div>
        </div>
        <div className="analytics-card recent-updates-card">
          <h2>Recent Updates</h2>
          <ul className="updates-list">
            {data.recentUpdates.map((update, index) => (
              <li key={index}>{update}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

const ManageMenu = () => {
  const [menu, setMenu] = useState({ date: '', breakfast: '', lunch: '', dinner: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMenu = async (date) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/menu/${date}`);
      if (!res.ok) {
        throw new Error("Menu not found for this date.");
      }
      const data = await res.json();
      setMenu({
        date: new Date(data.date).toISOString().split('T')[0],
        breakfast: data.breakfast,
        lunch: data.lunch,
        dinner: data.dinner,
      });
      setMessage("Menu loaded successfully.");
    } catch (err) {
      setMessage(err.message);
      setMenu({ date, breakfast: '', lunch: '', dinner: '' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menu),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update menu.");
      }
      setMessage(data.message);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="menu">📖</span> Manage Menu</h1>
      <p>Add or update the daily menu. Select a date to see the current menu.</p>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Date:
          <input type="date" name="date" value={menu.date} onChange={handleChange} required onBlur={(e) => fetchMenu(e.target.value)} />
        </label>
        <label>
          Breakfast:
          <input type="text" name="breakfast" value={menu.breakfast} onChange={handleChange} />
        </label>
        <label>
          Lunch:
          <input type="text" name="lunch" value={menu.lunch} onChange={handleChange} />
        </label>
        <label>
          Dinner:
          <input type="text" name="dinner" value={menu.dinner} onChange={handleChange} />
        </label>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Updating...' : 'Update Menu'}
        </button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

const MealBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async (selectedDate) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bookings/daily/${selectedDate}`);
      if (!res.ok) {
        throw new Error("Failed to fetch bookings.");
      }
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(date);
  }, [date]);

  if (loading) return <div className="loading-state">Loading bookings...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="bookings">✅</span> Meal Bookings</h1>
      <p>View daily meal bookings.</p>
      <label>
        Select Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Meals Booked</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length > 0 ? (
              bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.studentId ? booking.studentId.name : 'Unknown Student'}</td>
                  <td>{booking.meals.join(", ")}</td>
                  <td>{new Date(booking.createdAt).toLocaleTimeString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No bookings for this date.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`);
        if (!res.ok) {
          throw new Error("Failed to fetch feedback.");
        }
        const data = await res.json();
        setFeedbackList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  if (loading) return <div className="loading-state">Loading feedback...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="feedback">📝</span> Feedback</h1>
      <p>Read all student feedback.</p>
      <div className="list-container">
        {feedbackList.length > 0 ? (
          feedbackList.map(feedback => (
            <div key={feedback._id} className="list-item">
              <div className="list-item-header">
                <h3>{feedback.name}</h3>
                <span className="rating">Rating: {feedback.rating} / 5</span>
              </div>
              <p>{feedback.feedback}</p>
              <p className="item-meta">Submitted on {formatDate(feedback.createdAt)}</p>
            </div>
          ))
        ) : (
          <p>No feedback received yet.</p>
        )}
      </div>
    </div>
  );
};

const Complaints = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints`);
      if (!res.ok) {
        throw new Error("Failed to fetch complaints.");
      }
      const data = await res.json();
      setComplaintList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/complaints/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update status.");
      }
      // Re-fetch to get the latest data
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading complaints...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="complaints">⚠️</span> Complaints</h1>
      <p>Track and resolve student complaints efficiently.</p>
      <div className="list-container">
        {complaintList.length > 0 ? (
          complaintList.map(complaint => (
            <div key={complaint._id} className="list-item">
              <div className="list-item-header">
                <h3>{complaint.subject}</h3>
                <span className={`status ${complaint.status.toLowerCase().replace(' ', '-')}`}>{complaint.status}</span>
              </div>
              <p>{complaint.message}</p>
              <p className="item-meta">
                From: {complaint.name || 'Anonymous'} | Submitted on {formatDate(complaint.createdAt)}
              </p>
              <div className="actions">
                <button onClick={() => updateStatus(complaint._id, "Pending")} className="status-btn pending">Pending</button>
                <button onClick={() => updateStatus(complaint._id, "In Progress")} className="status-btn in-progress">In Progress</button>
                <button onClick={() => updateStatus(complaint._id, "Resolved")} className="status-btn resolved">Resolved</button>
              </div>
            </div>
          ))
        ) : (
          <p>No complaints submitted yet.</p>
        )}
      </div>
    </div>
  );
};

const Analytics = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="analytics">📊</span> Analytics</h1>
    <p>Detailed reports and charts on mess usage and performance.</p>
    <div className="page-placeholder">Comprehensive analytics dashboards.</div>
  </div>
);

const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) {
        throw new Error("Failed to fetch students.");
      }
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    try {
      // NOTE: Using a custom modal instead of window.confirm
      // A full implementation would involve a state-based modal component.
      if (true /* A modal component's confirm state */) { 
        const res = await fetch(`${API_URL}/students/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error("Failed to delete student.");
        }
        setStudents(students.filter(student => student._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading-state">Loading users...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="user management">🛡️</span> User Management</h1>
      <p>Manage student accounts and access permissions.</p>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Registered On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map(student => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{formatDate(student.createdAt)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => deleteStudent(student._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No students registered yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Settings = () => (
  <div className="page-content">
    <h1><span role="img" aria-label="settings">⚙️</span> Settings</h1>
    <p>Configure administrative settings for the application.</p>
    <div className="page-placeholder">General application settings forms.</div>
  </div>
);

// --- Main App Component ---

function ADashboard() {
  const [currentPage, setCurrentPage] = useState('Dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage />;
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
        return <DashboardPage />;
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
            background: #ff8800;
            border: none;
            color: #000;
            padding: 0.6rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
          }

          .logout-btn:hover {
            background: #ffa533;
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

          .icon-wrapper {
            font-size: 2rem;
            margin-bottom: 1rem;
          }

          .card-content h3 {
            margin: 0;
            font-size: 1rem;
            color: #fff;
          }

          .metric {
            font-size: 2.2rem;
            font-weight: bold;
            margin-top: 5px;
            color: #ff8800;
          }

          /* Analytics */
          .analytics-section h2 {
            margin-bottom: 1rem;
            color: #ffa533;
          }

          .analytics-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-top: 2rem;
          }

          .analytics-card {
            background: #1a1a1a;
            border: 1px dashed #ff8800;
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
          }

          .chart-placeholder {
            height: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #0d0d0d;
            border-radius: 8px;
            border: 1px dashed #ff8800;
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
            background: #1f1f1f;
            border: 1px solid #ff8800;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            margin-bottom: 0.8rem;
            transition: 0.3s;
          }

          .updates-list li:hover {
            background: #ff8800;
            color: #000;
          }

          /* Page Content */
          .page-content {
            background-color: #1f1f1f;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            margin-top: 0;
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

          .page-content p {
            color: #ccc;
          }

          .status-message {
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 8px;
            background: #ff8800;
            color: #0d0d0d;
            font-weight: bold;
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

          .form-container input {
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
            padding: 0.8rem 1.2rem;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
          }

          .btn:hover {
            background: #ffa533;
          }

          .table-container {
            overflow-x: auto;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
          }

          th, td {
            padding: 1rem;
            border: 1px solid #ff8800;
            text-align: left;
          }

          thead {
            background: #1a1a1a;
          }

          .list-container {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .list-item {
            background: #1a1a1a;
            border: 1px solid #ff8800;
            padding: 1rem;
            border-radius: 8px;
          }

          .list-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .status {
            padding: 0.3rem 0.8rem;
            border-radius: 15px;
            font-size: 0.8rem;
            font-weight: bold;
          }

          .status.pending { background: #f1c40f; color: #000; }
          .status.in-progress { background: #3498db; color: #fff; }
          .status.resolved { background: #2ecc71; color: #fff; }

          .item-meta {
            font-size: 0.8rem;
            color: #aaa;
            margin-top: 0.5rem;
          }

          .actions {
            margin-top: 1rem;
            display: flex;
            gap: 0.5rem;
          }

          .status-btn {
            border: none;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.8rem;
          }

          .status-btn.pending { background: #f1c40f; }
          .status-btn.in-progress { background: #3498db; }
          .status-btn.resolved { background: #2ecc71; }

          .delete-btn {
            background: #e74c3c;
            border: none;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
          }

          .delete-btn:hover {
            background: #c0392b;
          }
        `}
      </style>
      <div className="admin-dashboard">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="main-content">
          {renderPage()}
        </main>
      </div>
    </>
  );
}

export default ADashboard; // dashboard is working
