import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// The base URL for your backend API
const API_URL = "http://localhost:5000/api";

// Helper to get Authorization header from stored token
const getAuthHeader = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (err) {
    void err;
    return {};
  }
};

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
          fetch(`${API_URL}/bookings/${user._id}`, { headers: { ...getAuthHeader() } }),
          fetch(`${API_URL}/complaints/student/${user._id}`, { headers: { ...getAuthHeader() } })
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
        <h1 style={{color:"#ff8800"}}>WELCOME, {user.name}</h1>
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
          <h3 style={{margin:"0px 50px"}}>Notices</h3>
          <ul>
            {data.notices.map((notice, index) => (
              <li key={index}>{notice}</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h3 style={{margin:"0px 50px"}}>Feedback</h3>
          <p>Help us improve your dining experience.</p>
          <button className="btn">
            Give Feedback
          </button>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="analytics">
        <h2>Your Statistics</h2>
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
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
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
  const navigate = useNavigate();

  useEffect(() => {
    const initUser = async () => {
      try {
        const stored = localStorage.getItem("student");
        if (!stored) {
          navigate('/login');
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
        } catch (err) { void err; }
      } catch (err) {
        console.error('Failed to parse stored student:', err);
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, [navigate]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('student');
      localStorage.removeItem('token');
      setUser(null);
      // Use React Router navigation instead of hard redirect
      navigate('/');
    } catch (err) { void err; }
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
          .dashboard {
            display: flex;
            background: var(--bg-dark);
            color: var(--text-main);
            min-height: 100vh;
            font-family: 'Inter', sans-serif;
          }

          /* Sidebar */
          .sidebar {
            width: 260px;
            background: var(--bg-card);
            backdrop-filter: blur(16px);
            border-right: 1px solid var(--border-glass);
            padding: 2rem 1.5rem;
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            z-index: 50;
          }

          .sidebar .logo {
            font-size: 1.8rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 2.5rem;
            color: var(--text-main);
          }
          
          .sidebar .logo span {
            background: linear-gradient(135deg, var(--accent-orange), var(--accent-amber));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .sidebar .menu {
            list-style: none;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .sidebar .menu li {
            padding: 0.8rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: var(--text-muted);
          }

          .sidebar .menu li:hover,
          .sidebar .menu li.active {
            background: rgba(249, 115, 22, 0.1);
            color: var(--accent-orange);
            transform: translateX(4px);
          }

          /* Main Content */
          .main-content {
            margin-left: 260px;
            flex: 1;
            padding: 2.5rem;
            max-width: 1400px;
          }

          /* Topbar */
          .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2.5rem;
            position: sticky;
            top: 0;
            z-index: 40;
            backdrop-filter: blur(12px);
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-glass);
          }

          .topbar h1 {
            font-size: 2rem;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(135deg, var(--accent-orange), var(--accent-amber));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }

          .logout-btn {
            background: linear-gradient(135deg, var(--accent-orange), var(--accent-amber));
            border: none;
            color: #000;
            padding: 0.7rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
          }

          .logout-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
          }

          /* Cards */
          .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2.5rem;
          }

          .card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-glass);
            padding: 1.8rem;
            border-radius: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
          }

          .card:hover {
            transform: translateY(-4px);
            border-color: rgba(249, 115, 22, 0.3);
          }

          .card.highlight {
            border: 1px solid var(--accent-orange);
            box-shadow: 0 8px 22px rgba(249, 115, 22, 0.15);
          }

          .card.highlight h3 {
            color: var(--accent-orange);
          }

          .card h3 {
            color: var(--text-main);
            font-size: 1.25rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .card p {
            color: var(--text-muted);
            line-height: 1.6;
          }

          .btn {
            background: linear-gradient(135deg, var(--accent-orange), var(--accent-amber));
            border: none;
            color: #000;
            padding: 0.8rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
            margin-top: 1.5rem;
            display: inline-block;
          }

          .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4);
          }
          
          .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            background: #374151;
            box-shadow: none;
            color: #9ca3af;
          }

          /* Analytics */
          .analytics h2 {
            margin-bottom: 1.5rem;
            color: var(--text-main);
            font-weight: 600;
            font-size: 1.25rem;
          }

          .analytics-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.5rem;
          }

          .analytics-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-glass);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
          }
          
          .analytics-card:hover {
            border-color: rgba(249, 115, 22, 0.3);
            transform: translateY(-4px);
          }

          .analytics-card h3 {
            color: var(--text-muted);
            font-size: 1.1rem;
            margin-bottom: 0.8rem;
            font-weight: 500;
          }

          .analytics-card p {
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--accent-orange);
            margin: 0;
          }

          .page-content {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            padding: 2.5rem;
            border-radius: 16px;
            border: 1px solid var(--border-glass);
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }

          .page-content h1 {
            font-size: 2.2rem;
            margin-top: 0;
            margin-bottom: 1.5rem;
            color: var(--text-main);
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 700;
          }

          .page-content p {
            color: var(--text-muted);
            font-size: 1.05rem;
            margin-bottom: 2rem;
          }

          .status-message {
            margin-top: 1.5rem;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            background: rgba(249, 115, 22, 0.1);
            border: 1px solid var(--accent-orange);
            color: var(--accent-orange);
            font-weight: 600;
          }

          .form-container {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            max-width: 600px;
          }

          .form-container label {
            display: flex;
            flex-direction: column;
            color: var(--text-muted);
            font-weight: 500;
            gap: 0.5rem;
          }

          .form-container input, .form-container textarea {
            padding: 0.8rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-glass);
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-main);
            transition: all 0.3s ease;
            font-family: inherit;
          }
          
          .form-container input:focus, .form-container textarea:focus {
            outline: none;
            border-color: var(--accent-orange);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
          }

          .booking-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            background: rgba(255, 255, 255, 0.02);
            padding: 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--border-glass);
            max-width: 500px;
          }

          .booking-form label {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-main);
            font-weight: 500;
            font-size: 1.1rem;
            cursor: pointer;
          }
          
          .booking-form input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--accent-orange);
            cursor: pointer;
          }

          .menu-display {
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid var(--border-glass);
            padding: 2rem;
            border-radius: 16px;
          }
          
          .menu-display h3 {
            color: var(--accent-orange);
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
          }
          
          .menu-display p {
            font-size: 1.1rem;
            margin-bottom: 1rem;
          }
          
          .menu-display strong {
            color: var(--text-main);
          }

          .profile-details p {
            font-size: 1.1rem;
            margin-bottom: 1rem;
            color: var(--text-muted);
            background: rgba(255, 255, 255, 0.02);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            border: 1px solid var(--border-glass);
          }

          .profile-details strong {
            color: var(--text-main);
            margin-right: 8px;
          }

          /* Responsive Media Queries */
          @media (max-width: 768px) {
            .dashboard { flex-direction: column; }
            .sidebar {
              width: 100%;
              height: auto;
              position: relative;
              border-right: none;
              border-bottom: 1px solid var(--border-glass);
              padding: 1.5rem;
              z-index: 10;
            }
            .sidebar .logo { margin-bottom: 1.5rem; }
            .sidebar .menu { flex-direction: row; flex-wrap: wrap; justify-content: center; }
            .sidebar .menu li { padding: 0.6rem 1rem; font-size: 0.9rem; }
            .main-content { margin-left: 0; padding: 1.5rem; }
            .topbar { flex-direction: column; align-items: flex-start; gap: 1rem; }
            .cards { grid-template-columns: 1fr; }
            .profile-details { grid-template-columns: 1fr; }
          }
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
