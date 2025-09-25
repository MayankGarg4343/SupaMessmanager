import React, { useState, useEffect } from "react";

// The base URL for your backend API
const API_URL = "http://localhost:5000/api";

// --- Utility Functions --- 
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Page Components (defined within the same file) ---

const DashboardPage = ({ user, onLogout }) => {
  const [data, setData] = useState({
    todayMenu: {},
    mealsBooked: [],
    notices: ["Pizza Night this Saturday!", "🎉 Mess Fees Due by End of Week!"],
    yourStats: { mealsTaken: 0, foodSaved: 0, complaintsResolved: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [
          menuRes,
          bookingsRes,
          complaintsRes
        ] = await Promise.all([
          fetch(`${API_URL}/menu/${new Date().toISOString().split('T')[0]}`),
          fetch(`${API_URL}/bookings/${user._id}`),
          fetch(`${API_URL}/complaints/student/${user._id}`)
        ]);

        const menuData = menuRes.ok ? await menuRes.json() : {};
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const complaintsData = complaintsRes.ok ? await complaintsRes.json() : [];

        setData({
          todayMenu: menuData,
          mealsBooked: bookingsData.length > 0 ? bookingsData[0].meals : [],
          notices: ["Pizza Night this Saturday!", "🎉 Mess Fees Due by End of Week!"],
          yourStats: {
            mealsTaken: bookingsData.length,
            foodSaved: bookingsData.length * 0.1, // Mock data
            complaintsResolved: complaintsData.filter(c => c.status === 'Resolved').length
          }
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) return <div className="loading-state">Loading dashboard data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <>
      <header className="topbar">
        <h1>Welcome, {user.name} 👋</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </header>

      {/* Cards Section */}
      <section className="cards">
        <div className="card highlight">
          <h3>Today's Menu</h3>
          {Object.keys(data.todayMenu).length > 0 ? (
            <p>
              🍲 <strong>Breakfast:</strong> {data.todayMenu.breakfast} <br />
              🍛 <strong>Lunch:</strong> {data.todayMenu.lunch} <br />
              🍽 <strong>Dinner:</strong> {data.todayMenu.dinner}
            </p>
          ) : (
            <p>No menu available for today.</p>
          )}
        </div>

        <div className="card">
          <h3>Meal Booking</h3>
          <p>
            You have booked <strong>{data.mealsBooked.length > 0 ? data.mealsBooked.join(" & ") : "no meals"}</strong> today.
          </p>
          <button className="btn">Manage Meals</button>
        </div>

        <div className="card">
          <h3>Notices</h3>
          <ul>
            {data.notices.map((notice, index) => (
              <li key={index}>{notice}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3>Feedback</h3>
          <p>Help us improve your dining experience.</p>
          <button className="btn">
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
            <p>{data.yourStats.mealsTaken} this month</p>
          </div>
          <div className="analytics-card">
            <h3>Food Saved</h3>
            <p>{data.yourStats.foodSaved} kg avoided</p>
          </div>
          <div className="analytics-card">
            <h3>Complaints Resolved</h3>
            <p>{data.yourStats.complaintsResolved} resolved</p>
          </div>
        </div>
      </section>
    </>
  );
};

const TodaysMenu = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/${new Date().toISOString().split('T')[0]}`);
        if (!res.ok) {
          throw new Error("Menu not found for this date.");
        }
        const data = await res.json();
        setMenu(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  if (loading) return <div className="loading-state">Loading menu...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="menu">📖</span> Today's Menu</h1>
      {menu ? (
        <div className="menu-display">
          <h3>{formatDate(menu.date)}</h3>
          <p><strong>Breakfast:</strong> {menu.breakfast}</p>
          <p><strong>Lunch:</strong> {menu.lunch}</p>
          <p><strong>Dinner:</strong> {menu.dinner}</p>
        </div>
      ) : (
        <p>No menu available for today.</p>
      )}
    </div>
  );
};

const MealBooking = ({ user }) => {
  const [meals, setMeals] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setMeals([...meals, value]);
    } else {
      setMeals(meals.filter(meal => meal !== value));
    }
  };

  const handleBooking = async () => {
    if (!user) {
      setMessage("Please log in to book meals.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user._id,
          date: new Date().toISOString().split('T')[0],
          meals,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book meals.");
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
      <h1><span role="img" aria-label="booking">✅</span> Meal Booking</h1>
      <p>Select your meals for today.</p>
      <div className="booking-form">
        <label>
          <input type="checkbox" name="meals" value="Breakfast" onChange={handleCheckboxChange} /> Breakfast
        </label>
        <label>
          <input type="checkbox" name="meals" value="Lunch" onChange={handleCheckboxChange} /> Lunch
        </label>
        <label>
          <input type="checkbox" name="meals" value="Dinner" onChange={handleCheckboxChange} /> Dinner
        </label>
        <button className="btn" onClick={handleBooking} disabled={loading || !user}>
          {loading ? "Booking..." : "Book Meals"}
        </button>
      </div>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

const FeedbackPage = ({ user }) => {
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', rating: 5, feedback: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFeedbackData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFeedbackData({ ...feedbackData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("Please log in to submit feedback.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback.");
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
      <h1><span role="img" aria-label="feedback">📝</span> Feedback</h1>
      <p>Share your feedback on the food and services.</p>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Name:
          <input type="text" name="name" value={feedbackData.name} onChange={handleChange} required disabled={!!user} />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={feedbackData.email} onChange={handleChange} required disabled={!!user} />
        </label>
        <label>
          Rating:
          <input type="number" name="rating" min="1" max="5" value={feedbackData.rating} onChange={handleChange} required />
        </label>
        <label>
          Feedback:
          <textarea name="feedback" value={feedbackData.feedback} onChange={handleChange} required />
        </label>
        <button type="submit" className="btn" disabled={loading || !user}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

const Complaints = ({ user }) => {
  const [complaintData, setComplaintData] = useState({ subject: '', message: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setMessage("Please log in to submit a complaint.");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user._id,
          ...complaintData,
          name: user.name,
          email: user.email
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit complaint.");
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
      <h1><span role="img" aria-label="complaints">⚠️</span> Complaints</h1>
      <p>Submit a new complaint.</p>
      <form onSubmit={handleSubmit} className="form-container">
        <label>
          Subject:
          <input type="text" name="subject" value={complaintData.subject} onChange={handleChange} required />
        </label>
        <label>
          Message:
          <textarea name="message" value={complaintData.message} onChange={handleChange} required />
        </label>
        <button type="submit" className="btn" disabled={loading || !user}>
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>
      {message && <div className="status-message">{message}</div>}
    </div>
  );
};

// Lightweight SVG Bar Chart for student analytics
function SBarChart({ data, height = 160, barColor = "#ff8800", labelColor = "#ccc" }) {
  const max = Math.max(1, ...data.map(d => d.value));
  const barW = Math.max(16, Math.floor(240 / Math.max(1, data.length)));
  const gap = 10;
  const width = data.length * (barW + gap) - gap;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * (height - 36));
        const x = i * (barW + gap);
        const y = height - h - 18;
        return (
          <g key={d.label} transform={`translate(${x},0)`}>
            <rect x={0} y={y} width={barW} height={h} rx={6} fill={barColor} />
            <text x={barW / 2} y={height - 4} textAnchor="middle" fontSize="10" fill={labelColor}>{d.label}</text>
            <text x={barW / 2} y={y - 4} textAnchor="middle" fontSize="11" fill={labelColor}>{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

const Analytics = ({ user }) => {
  const [mealsByType, setMealsByType] = useState([
    { label: 'Breakfast', value: 0 },
    { label: 'Lunch', value: 0 },
    { label: 'Dinner', value: 0 },
  ]);
  const [complaintsStatus, setComplaintsStatus] = useState([
    { label: 'Pending', value: 0 },
    { label: 'In Progress', value: 0 },
    { label: 'Resolved', value: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        // Fetch this student's bookings and complaints
        const [bookingsRes, complaintsRes] = await Promise.all([
          fetch(`${API_URL}/bookings/${user._id}`),
          fetch(`${API_URL}/complaints/student/${user._id}`),
        ]);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
        const complaints = complaintsRes.ok ? await complaintsRes.json() : [];

        // Meals by type across student's bookings
        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach(b => (b.meals || []).forEach(m => { if (mealsBy[m] !== undefined) mealsBy[m]++; }));
        setMealsByType([
          { label: 'Breakfast', value: mealsBy.Breakfast },
          { label: 'Lunch', value: mealsBy.Lunch },
          { label: 'Dinner', value: mealsBy.Dinner },
        ]);

        // Complaints status distribution for this student
        const compBy = { 'Pending': 0, 'In Progress': 0, 'Resolved': 0 };
        complaints.forEach(c => { if (compBy[c.status] !== undefined) compBy[c.status]++; });
        setComplaintsStatus([
          { label: 'Pending', value: compBy['Pending'] },
          { label: 'In Progress', value: compBy['In Progress'] },
          { label: 'Resolved', value: compBy['Resolved'] },
        ]);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="analytics">📊</span> Analytics</h1>
      {loading && <div className="loading-state">Loading analytics...</div>}
      {error && <div className="error-state">Error: {error}</div>}
      {!loading && !error && (
        <>
          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>Meals You've Booked (All Time)</h3>
              <SBarChart data={mealsByType} />
            </div>
            <div className="analytics-card">
              <h3>Your Complaints Status</h3>
              <SBarChart data={complaintsStatus} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Profile = ({ user }) => {
  if (!user) return <div className="loading-state">Loading profile...</div>;

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="profile">👤</span> Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Registered On:</strong> {formatDate(user.createdAt)}</p>
      </div>
    </div>
  );
};

// --- Main App Component ---

function SDashboard() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      try {
        const stored = localStorage.getItem("student");
        if (!stored) {
          window.location.href = '/login';
          return;
        }
        const parsed = JSON.parse(stored);
        const normalized = { ...parsed, _id: parsed?._id || parsed?.id };
        setUser(normalized);

        // Optionally enrich with createdAt from server list
        try {
          const res = await fetch(`${API_URL}/students`);
          if (res.ok) {
            const students = await res.json();
            const match = students.find(s => (s._id || s.id) === normalized._id);
            if (match && match.createdAt && !normalized.createdAt) {
              setUser(prev => ({ ...prev, createdAt: match.createdAt }));
            }
          }
        } catch (_) { /* non-blocking */ }
      } catch (err) {
        console.error('Failed to parse stored student:', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const handleLogout = () => {
    try { localStorage.removeItem('student'); } catch(_){}
    setUser(null);
    window.location.href = '/';
  };

  if (loading) return <div className="full-screen-loader">Loading user data...</div>;
  if (!user) return null; // Or show a message while redirecting

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} />;
      case 'Today\'s Menu':
        return <TodaysMenu />;
      case 'Meal Booking':
        return <MealBooking user={user} />;
      case 'Feedback':
        return <FeedbackPage user={user} />;
      case 'Complaints':
        return <Complaints user={user} />;
      case 'Analytics':
        return <Analytics user={user} />;
      case 'Profile':
        return <Profile user={user} />;
      default:
        return <DashboardPage user={user} onLogout={handleLogout} />;
    }
  };

  return (
    <>
      <style>
        {`
          /* Student Dashboard Layout */
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          .dashboard {
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
          .sidebar .logo span {
            color: #fff;
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

          .topbar h1 {
            font-size: 2rem;
            font-weight: bold;
            color: #ff8800;
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
            transition: 0.3s;
          }

          .card h3 {
            margin-top: 0;
            color: #fff;
          }

          .card.highlight {
            border: 1px solid #ff8800;
            background: #ff8800;
            color: #000;
          }

          .card.highlight h3 {
            color: #000;
          }

          .card.highlight p {
            color: #000;
          }

          .card p {
            color: #ccc;
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

          /* Analytics */
          .analytics h2 {
            margin-bottom: 1rem;
            color: #ffa533;
            border-bottom: 2px solid #ff8800;
            padding-bottom: 10px;
          }

          .analytics-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .analytics-card {
            background: #1f1f1f;
            border: 1px dashed #ff8800;
            padding: 1.5rem;
            border-radius: 10px;
            text-align: center;
          }

          .analytics-card h3 {
            color: #fff;
          }

          .analytics-card p {
            font-size: 1.2rem;
            font-weight: bold;
            color: #ff8800;
          }

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

          .form-container input, .form-container textarea {
            padding: 0.5rem;
            border-radius: 6px;
            border: 1px solid #ff8800;
            background-color: #1a1a1a;
            color: #fff;
          }

          .booking-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .booking-form label {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #ff8800;
            font-weight: bold;
          }

          .menu-display {
            background-color: #1a1a1a;
            border: 1px solid #ff8800;
            padding: 1.5rem;
            border-radius: 12px;
          }
          .menu-display h3 {
            color: #ff8800;
          }

          .profile-details p {
            font-size: 1.1rem;
            margin-bottom: 10px;
            color: #ff8800;
          }

          .profile-details strong {
            color: #fff;
          }
          /* --- Layout/Structure Enhancements (preserve existing color theme) --- */
          .dashboard { gap: 0; }
          .sidebar { width: 260px; }
          .sidebar .menu li { display: flex; align-items: center; gap: 10px; }
          .sidebar .menu li { line-height: 1.2; }

          .topbar { position: sticky; top: 0; backdrop-filter: saturate(120%) blur(2px); }

          .cards { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
          .card { border-radius: 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.2); }
          .card.highlight { box-shadow: 0 8px 22px rgba(255, 136, 0, 0.25); }

          .main-content { max-width: 1200px; }
          .analytics-cards { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
          .profile-details { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

          .form-container input, .form-container textarea { outline: none; transition: box-shadow .2s ease; }
          .form-container input:focus, .form-container textarea:focus { box-shadow: 0 0 0 2px rgba(255,136,0,0.35); }

          .booking-form { grid-template-columns: 1fr; }
          .menu-display { border-radius: 14px; box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
        `}
      </style>
      <div className="dashboard">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2 className="logo"><span>Mess</span>Mate</h2>
          <ul className="menu">
            <li className={currentPage === 'Dashboard' ? 'active' : ''} onClick={() => setCurrentPage('Dashboard')}>Dashboard</li>
            <li className={currentPage === 'Today\'s Menu' ? 'active' : ''} onClick={() => setCurrentPage('Today\'s Menu')}>Today's Menu</li>
            <li className={currentPage === 'Meal Booking' ? 'active' : ''} onClick={() => setCurrentPage('Meal Booking')}>Meal Booking</li>
            <li className={currentPage === 'Feedback' ? 'active' : ''} onClick={() => setCurrentPage('Feedback')}>Feedback</li>
            <li className={currentPage === 'Complaints' ? 'active' : ''} onClick={() => setCurrentPage('Complaints')}>Complaints</li>
            <li className={currentPage === 'Analytics' ? 'active' : ''} onClick={() => setCurrentPage('Analytics')}>Analytics</li>
            <li className={currentPage === 'Profile' ? 'active' : ''} onClick={() => setCurrentPage('Profile')}>Profile</li>
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

export default SDashboard;

// now the student is able to see the menu which is being updated by the admin.
