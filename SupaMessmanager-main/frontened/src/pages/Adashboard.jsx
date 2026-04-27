import React, { useState, useEffect } from "react";

// Lightweight SVG Charts (no external deps)
function BarChart({ data, height = 180, barColor = "#ff8800", labelColor = "#aaa" }) {
  const max = Math.max(1, ...data.map(d => d.value));
  const barW = Math.max(16, Math.floor(240 / Math.max(1, data.length)));
  const gap = 10;
  const width = data.length * (barW + gap) - gap;
  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {data.map((d, i) => {
        const h = Math.round((d.value / max) * (height - 40));
        const x = i * (barW + gap);
        const y = height - h - 20;
        return (
          <g key={d.label} transform={`translate(${x},0)`}>
            <rect x={0} y={y} width={barW} height={h} rx={6} fill={barColor} />
            <text x={barW / 2} y={height - 6} textAnchor="middle" fontSize="10" fill={labelColor}>{d.label}</text>
            <text x={barW / 2} y={y - 6} textAnchor="middle" fontSize="11" fill={labelColor}>{d.value}</text>
          </g>
        );
      })}
    </svg>
  );
}

function Legend({ items }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 8 }}>
      {items.map(it => (
        <div key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, background: it.color, display: 'inline-block', borderRadius: 2 }} />
          <span style={{ color: '#aaa', fontSize: 12 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// Simple line chart without external deps
function LineChart({ series, height = 180, stroke = "#ff8800" }) {
  const width = Math.max(280, series.length * 44);
  const max = Math.max(1, ...series.map(p => p.value));
  const points = series.map((p, i) => {
    const x = i * (width / Math.max(1, series.length - 1));
    const y = height - (p.value / max) * (height - 30) - 20;
    return { x, y, label: p.label, value: p.value };
  });

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points.map(p => `${p.x},${p.y}`).join(' ')} />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill={stroke} />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="10" fill="#aaa">{p.value}</text>
          <text x={p.x} y={height - 6} textAnchor="middle" fontSize="10" fill="#aaa">{p.label.slice(5)}</text>
        </g>
      ))}
    </svg>
  );
}

// The base URL for your backend API
const API_URL = "http://localhost:5000/api";

// --- Utility Functions ---
const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Page Components (defined within the same file) ---

const DashboardPage = () => {
  const [analyticsDate, setAnalyticsDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({
    totalStudents: 0,
    activeComplaints: 0,
    feedbackReceived: 0,
    mealsBooked: 0,
    recentUpdates: [],
    mealsByType: [
      { label: 'Breakfast', value: 0 },
      { label: 'Lunch', value: 0 },
      { label: 'Dinner', value: 0 },
    ],
    ratingsDist: [
      { label: '1★', value: 0 },
      { label: '2★', value: 0 },
      { label: '3★', value: 0 },
      { label: '4★', value: 0 },
      { label: '5★', value: 0 },
    ],
    complaintsStatus: [
      { label: 'Pending', value: 0 },
      { label: 'In Progress', value: 0 },
      { label: 'Resolved', value: 0 },
    ],
  });
  const [weeklyMeals, setWeeklyMeals] = useState([]); // [{label: 'YYYY-MM-DD', value}]
  const [weeklyComplaints, setWeeklyComplaints] = useState([]);
  const [weeklyFeedback, setWeeklyFeedback] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [allFeedback, setAllFeedback] = useState([]);
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
          fetch(`${API_URL}/bookings/daily/${analyticsDate}`),
        ]);

        if (!studentsRes.ok || !complaintsRes.ok || !feedbackRes.ok || !bookingsRes.ok) {
          throw new Error("Failed to fetch dashboard data.");
        }

        const students = await studentsRes.json();
        const complaints = await complaintsRes.json();
        const feedback = await feedbackRes.json();
        setAllComplaints(complaints);
        setAllFeedback(feedback);
        const bookings = await bookingsRes.json();

        const activeComplaintsCount = complaints.filter(c => c.status !== "Resolved").length;
        const mealsBookedCount = bookings.reduce((sum, booking) => sum + booking.meals.length, 0);

        // Analytics distributions
        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach(b => (b.meals || []).forEach(m => { if (mealsBy[m] !== undefined) mealsBy[m]++; }));

        const ratingsBy = { 1:0, 2:0, 3:0, 4:0, 5:0 };
        feedback.forEach(f => { const r = Number(f.rating); if (ratingsBy[r] !== undefined) ratingsBy[r]++; });

        const compBy = { 'Pending':0, 'In Progress':0, 'Resolved':0 };
        complaints.forEach(c => { if (compBy[c.status] !== undefined) compBy[c.status]++; });

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
          mealsByType: [
            { label: 'Breakfast', value: mealsBy.Breakfast },
            { label: 'Lunch', value: mealsBy.Lunch },
            { label: 'Dinner', value: mealsBy.Dinner },
          ],
          ratingsDist: [
            { label: '1★', value: ratingsBy[1] },
            { label: '2★', value: ratingsBy[2] },
            { label: '3★', value: ratingsBy[3] },
            { label: '4★', value: ratingsBy[4] },
            { label: '5★', value: ratingsBy[5] },
          ],
          complaintsStatus: [
            { label: 'Pending', value: compBy['Pending'] },
            { label: 'In Progress', value: compBy['In Progress'] },
            { label: 'Resolved', value: compBy['Resolved'] },
          ],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analyticsDate]);

  // Removed LineChart component from here

  // Fetch last 7 days ending at analyticsDate
  useEffect(() => {
    const loadWeekly = async () => {
      try {
        const base = new Date(analyticsDate);
        const days = [...Array(7)].map((_, idx) => {
          const d = new Date(base);
          d.setDate(base.getDate() - (6 - idx));
          return d.toISOString().split('T')[0];
        });
        const responses = await Promise.all(days.map(d => fetch(`${API_URL}/bookings/daily/${d}`)));
        const jsons = await Promise.all(responses.map(r => (r.ok ? r.json() : [])));
        const totals = jsons.map(list => list.reduce((sum, b) => sum + (b.meals?.length || 0), 0));
        setWeeklyMeals(days.map((d, i) => ({ label: d, value: totals[i] })));

        // Complaints per day using allComplaints (createdAt)
        const compTotals = days.map((d) => {
          return allComplaints.filter(c => new Date(c.createdAt).toISOString().split('T')[0] === d).length;
        });
        setWeeklyComplaints(days.map((d, i) => ({ label: d, value: compTotals[i] })));

        // Feedback per day using allFeedback (createdAt)
        const feedTotals = days.map((d) => {
          return allFeedback.filter(f => new Date(f.createdAt).toISOString().split('T')[0] === d).length;
        });
        setWeeklyFeedback(days.map((d, i) => ({ label: d, value: feedTotals[i] })));
      } catch (err) {
        void err;
      }
    };
    loadWeekly();
  }, [analyticsDate, allComplaints, allFeedback]);

  if (loading) return <div className="loading-state">Loading dashboard data...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <>
      <header className="topbar">
        <h1>Welcome, Admin 👋</h1>
        <button className="logout-btn">
          Logout
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

      {/* Top Level Analytics Summary */}
      <section className="analytics-section">
        <div className="analytics-card recent-updates-card" style={{ gridColumn: '1 / -1' }}>
          <h2>Recent Updates</h2>
          <ul className="updates-list">
            {data.recentUpdates.length > 0 ? (
              data.recentUpdates.map((update, index) => (
                <li key={index}>{update}</li>
              ))
            ) : (
              <li>No recent updates.</li>
            )}
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

const Analytics = () => {
  const [analyticsDate, setAnalyticsDate] = useState(new Date().toISOString().split('T')[0]);
  const [data, setData] = useState({
    mealsByType: [{ label: 'Breakfast', value: 0 }, { label: 'Lunch', value: 0 }, { label: 'Dinner', value: 0 }],
    ratingsDist: [{ label: '1★', value: 0 }, { label: '2★', value: 0 }, { label: '3★', value: 0 }, { label: '4★', value: 0 }, { label: '5★', value: 0 }],
    complaintsStatus: [{ label: 'Pending', value: 0 }, { label: 'In Progress', value: 0 }, { label: 'Resolved', value: 0 }],
  });
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [weeklyComplaints, setWeeklyComplaints] = useState([]);
  const [weeklyFeedback, setWeeklyFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintsRes, feedbackRes, bookingsRes] = await Promise.all([
          fetch(`${API_URL}/complaints`),
          fetch(`${API_URL}/feedback`),
          fetch(`${API_URL}/bookings/daily/${analyticsDate}`),
        ]);

        const complaints = await complaintsRes.json();
        const feedback = await feedbackRes.json();
        const bookings = await bookingsRes.json();

        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach(b => (b.meals || []).forEach(m => { if (mealsBy[m] !== undefined) mealsBy[m]++; }));

        const ratingsBy = { 1:0, 2:0, 3:0, 4:0, 5:0 };
        feedback.forEach(f => { const r = Number(f.rating); if (ratingsBy[r] !== undefined) ratingsBy[r]++; });

        const compBy = { 'Pending':0, 'In Progress':0, 'Resolved':0 };
        complaints.forEach(c => { if (compBy[c.status] !== undefined) compBy[c.status]++; });

        setData({
          mealsByType: [
            { label: 'Breakfast', value: mealsBy.Breakfast },
            { label: 'Lunch', value: mealsBy.Lunch },
            { label: 'Dinner', value: mealsBy.Dinner },
          ],
          ratingsDist: [
            { label: '1★', value: ratingsBy[1] },
            { label: '2★', value: ratingsBy[2] },
            { label: '3★', value: ratingsBy[3] },
            { label: '4★', value: ratingsBy[4] },
            { label: '5★', value: ratingsBy[5] },
          ],
          complaintsStatus: [
            { label: 'Pending', value: compBy['Pending'] },
            { label: 'In Progress', value: compBy['In Progress'] },
            { label: 'Resolved', value: compBy['Resolved'] },
          ],
        });

        // Weekly trends
        const base = new Date(analyticsDate);
        const days = [...Array(7)].map((_, idx) => {
          const d = new Date(base);
          d.setDate(base.getDate() - (6 - idx));
          return d.toISOString().split('T')[0];
        });
        
        const responses = await Promise.all(days.map(d => fetch(`${API_URL}/bookings/daily/${d}`)));
        const jsons = await Promise.all(responses.map(r => (r.ok ? r.json() : [])));
        const totals = jsons.map(list => list.reduce((sum, b) => sum + (b.meals?.length || 0), 0));
        setWeeklyMeals(days.map((d, i) => ({ label: d, value: totals[i] })));

        const compTotals = days.map(d => complaints.filter(c => new Date(c.createdAt).toISOString().split('T')[0] === d).length);
        setWeeklyComplaints(days.map((d, i) => ({ label: d, value: compTotals[i] })));

        const feedTotals = days.map(d => feedback.filter(f => new Date(f.createdAt).toISOString().split('T')[0] === d).length);
        setWeeklyFeedback(days.map((d, i) => ({ label: d, value: feedTotals[i] })));

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analyticsDate]);

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="analytics">📊</span> Analytics Dashboard</h1>
      <p>Detailed reports and charts on mess usage and performance.</p>
      
      <div className="form-container" style={{ marginBottom: '2rem' }}>
        <label>
          Data For Date:
          <input type="date" value={analyticsDate} onChange={(e) => setAnalyticsDate(e.target.value)} />
        </label>
      </div>

      {loading ? (
        <div className="loading-state">Loading charts...</div>
      ) : (
        <>
          <section className="analytics-section" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
            <div className="analytics-card chart-card">
              <h2>Meals Booked</h2>
              <BarChart data={data.mealsByType} barColor="#f97316" />
            </div>
            <div className="analytics-card">
              <h2>Feedback Ratings</h2>
              <BarChart data={data.ratingsDist} barColor="#f59e0b" />
            </div>
            <div className="analytics-card">
              <h2>Complaints Status</h2>
              <BarChart data={data.complaintsStatus} barColor="#3b82f6" />
            </div>
          </section>

          <section className="analytics-section" style={{ gridTemplateColumns: '1fr' }}>
            <div className="analytics-card">
              <h2>Meals Trend (Last 7 Days)</h2>
              <LineChart series={weeklyMeals} stroke="#f97316" />
            </div>
            <div className="analytics-card">
              <h2>Complaints Trend (Last 7 Days)</h2>
              <LineChart series={weeklyComplaints} stroke="#ef4444" />
            </div>
            <div className="analytics-card">
              <h2>Feedback Trend (Last 7 Days)</h2>
              <LineChart series={weeklyFeedback} stroke="#f59e0b" />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

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
      // eslint-disable-next-line no-constant-condition
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

const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('adminSettings');
    return saved ? JSON.parse(saved) : {
      messName: 'SupaMess',
      adminEmail: 'admin@messmate.com',
      enableNotifications: true,
      maintenanceMode: false
    };
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    setStatus('Settings saved successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className="page-content">
      <h1><span role="img" aria-label="settings">⚙️</span> Settings</h1>
      <p>Configure administrative settings for the application. (Saved locally)</p>
      
      {status && <div className="status-message">{status}</div>}

      <form onSubmit={handleSave} className="form-container" style={{ marginTop: '2rem' }}>
        <label>
          Mess Name:
          <input type="text" name="messName" value={settings.messName} onChange={handleChange} required />
        </label>
        
        <label>
          Admin Contact Email:
          <input type="email" name="adminEmail" value={settings.adminEmail} onChange={handleChange} required />
        </label>
        
        <label style={{ flexDirection: 'row', alignItems: 'center', cursor: 'pointer', gap: '10px', marginTop: '1rem' }}>
          <input type="checkbox" name="enableNotifications" checked={settings.enableNotifications} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }} />
          Enable Email Notifications for Complaints
        </label>
        
        <label style={{ flexDirection: 'row', alignItems: 'center', cursor: 'pointer', gap: '10px' }}>
          <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-orange)' }} />
          Enable Maintenance Mode (Disable Student Logins)
        </label>

        <button type="submit" className="btn">Save Configuration</button>
      </form>
    </div>
  );
};

// --- Main App Component ---

function Adashboard() {
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
          .admin-dashboard {
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
            font-size: 1.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 2.5rem;
            color: var(--text-main);
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
            color: var(--text-main);
            margin: 0;
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
            text-align: left;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            position: relative;
            overflow: hidden;
          }

          .card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 4px; height: 100%;
            background: linear-gradient(to bottom, var(--accent-orange), var(--accent-amber));
            opacity: 0;
            transition: 0.3s;
          }

          .card:hover {
            transform: translateY(-4px);
            border-color: rgba(249, 115, 22, 0.3);
          }

          .card:hover::before {
            opacity: 1;
          }

          .icon-wrapper {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            display: inline-block;
            background: rgba(249, 115, 22, 0.1);
            padding: 0.8rem;
            border-radius: 12px;
          }

          .card-content h3 {
            margin: 0;
            font-size: 1.1rem;
            color: var(--text-muted);
            font-weight: 500;
          }

          .metric {
            font-size: 2.5rem;
            font-weight: 700;
            margin-top: 8px;
            color: var(--text-main);
            font-variant-numeric: tabular-nums;
          }

          /* Analytics Section */
          .analytics-section {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
            margin-top: 2rem;
          }

          .analytics-section h2 {
            margin-bottom: 1.5rem;
            color: var(--text-main);
            font-weight: 600;
            font-size: 1.25rem;
          }

          .analytics-card {
            background: var(--bg-card);
            backdrop-filter: blur(12px);
            border: 1px solid var(--border-glass);
            padding: 2rem;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
          }

          .updates-list {
            list-style: none;
            padding: 0;
            text-align: left;
          }

          .updates-list li {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-glass);
            padding: 1rem 1.2rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            transition: all 0.3s;
            color: var(--text-muted);
            font-size: 0.95rem;
          }

          .updates-list li:hover {
            border-color: rgba(249, 115, 22, 0.3);
            background: rgba(249, 115, 22, 0.05);
            color: var(--text-main);
          }

          /* Page Content */
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

          /* Forms & Tables */
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

          .form-container input {
            padding: 0.8rem 1rem;
            border-radius: 8px;
            border: 1px solid var(--border-glass);
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-main);
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .form-container input:focus {
            outline: none;
            border-color: var(--accent-orange);
            box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
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
            margin-top: 1rem;
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

          .table-container {
            overflow-x: auto;
            border-radius: 12px;
            border: 1px solid var(--border-glass);
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th, td {
            padding: 1.2rem 1rem;
            text-align: left;
            border-bottom: 1px solid var(--border-glass);
          }

          th {
            background: rgba(0, 0, 0, 0.2);
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 0.85rem;
            letter-spacing: 0.05em;
          }

          td {
            color: var(--text-main);
          }

          /* Lists & Items */
          .list-container {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            margin-top: 1rem;
          }

          .list-item {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid var(--border-glass);
            padding: 1.5rem;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .list-item:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(249, 115, 22, 0.3);
          }

          .list-item-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
          }

          .list-item-header h3 {
            margin: 0;
            color: var(--text-main);
            font-size: 1.1rem;
            font-weight: 600;
          }

          .status {
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .status.pending { background: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
          .status.in-progress { background: rgba(59, 130, 246, 0.2); color: #93c5fd; border: 1px solid rgba(59, 130, 246, 0.3); }
          .status.resolved { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }

          .rating {
            background: rgba(249, 115, 22, 0.2);
            color: var(--accent-orange);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            border: 1px solid rgba(249, 115, 22, 0.3);
          }

          .item-meta {
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-top: 1rem;
          }

          .actions {
            margin-top: 1.2rem;
            display: flex;
            gap: 0.8rem;
            flex-wrap: wrap;
          }

          .status-btn {
            border: none;
            color: #fff;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .status-btn:hover {
            transform: translateY(-2px);
          }

          .status-btn.pending { background: #d97706; }
          .status-btn.pending:hover { background: #f59e0b; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4); }
          
          .status-btn.in-progress { background: #2563eb; }
          .status-btn.in-progress:hover { background: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4); }
          
          .status-btn.resolved { background: #059669; }
          .status-btn.resolved:hover { background: #10b981; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4); }

          .delete-btn {
            background: rgba(220, 38, 38, 0.2);
            border: 1px solid rgba(220, 38, 38, 0.3);
            color: #fca5a5;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .delete-btn:hover {
            background: #ef4444;
            color: #fff;
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
            transform: translateY(-2px);
          }

          /* Responsive Media Queries */
          @media (max-width: 1024px) {
            .analytics-section { grid-template-columns: 1fr; }
          }

          @media (max-width: 768px) {
            .admin-dashboard { flex-direction: column; }
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

export default Adashboard; // dashboard is working
