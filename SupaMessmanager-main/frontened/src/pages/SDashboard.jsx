import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { AreaChart, PremiumBarChart, Sparkline } from "../components/ui/chart";
import { Skeleton } from "../components/ui/skeleton";
import { showToast } from "../utils/toast";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  AlertCircle,
  BarChart3,
  User,
  LogOut,
  Menu as MenuIcon,
  X,
  Sun,
  Moon,
  Clock,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Loader2,
  Utensils,
  CheckCircle2
} from "lucide-react";
import { API_URL } from "../config";

const getAuthHeader = () => {
  try {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch (err) {
    void err;
    return {};
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// --- Dashboard Page (Overview) ---
const DashboardPage = ({ user, onLogout, setActivePage }) => {
  const [data, setData] = useState({
    todayMenu: {},
    mealsBooked: [],
    notices: ["Pizza Night this Saturday! 🍕", "🎉 Mess Fees Due by End of Week!"],
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
        const [menuRes, bookingsRes, complaintsRes] = await Promise.all([
          fetch(`${API_URL}/menu/${new Date().toISOString().split('T')[0]}`),
          fetch(`${API_URL}/bookings/${user._id}`, { headers: { ...getAuthHeader() } }),
          fetch(`${API_URL}/complaints/student/${user._id}`, { headers: { ...getAuthHeader() } })
        ]);

        const menuData = menuRes.ok ? await menuRes.json() : {};
        const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
        const complaintsData = complaintsRes.ok ? await complaintsRes.json() : [];

        setData({
          todayMenu: menuData,
          mealsBooked: bookingsData.length > 0 ? (bookingsData[0].meals || []) : [],
          notices: ["Pizza Night this Saturday! 🍕", "🎉 Mess Fees Due by End of Week!"],
          yourStats: {
            mealsTaken: bookingsData.length,
            foodSaved: bookingsData.length * 0.1, // Mock formula
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (error) return <div className="text-destructive font-bold p-6">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Welcome, {user.name} <Sparkles className="text-primary h-6 w-6 animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Check today's serving status, schedule your meals, and monitor dining analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setActivePage('Meal Booking')}>
            Quick Book
          </Button>
          <Button variant="destructive" size="sm" onClick={onLogout} className="gap-2">
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </div>

      {/* Main Grid Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Today's Menu */}
        <Card className="border-primary/20 md:col-span-2 shadow-lg">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="text-primary h-5 w-5" /> Today's Menu
              </CardTitle>
              <CardDescription>Daily meals for Chitkara Campus</CardDescription>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setActivePage("Today's Menu")}>
              View Details <ChevronRight size={14} />
            </Button>
          </CardHeader>
          <CardContent>
            {Object.keys(data.todayMenu).length > 0 ? (
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-muted/30 border border-border/10">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Breakfast</div>
                  <div className="text-sm font-semibold mt-1 text-foreground">{data.todayMenu.breakfast || "N/A"}</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/10">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Lunch</div>
                  <div className="text-sm font-semibold mt-1 text-foreground">{data.todayMenu.lunch || "N/A"}</div>
                </div>
                <div className="p-3 rounded-xl bg-muted/30 border border-border/10">
                  <div className="text-xs font-bold text-muted-foreground uppercase">Dinner</div>
                  <div className="text-sm font-semibold mt-1 text-foreground">{data.todayMenu.dinner || "N/A"}</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No menu uploaded for today.</p>
            )}
          </CardContent>
        </Card>

        {/* Meal Booking Summary */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <CalendarCheck className="text-primary h-5 w-5" /> Booking Status
            </CardTitle>
            <CardDescription>Meals secured for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              {data.mealsBooked.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {data.mealsBooked.map((meal) => (
                    <span key={meal} className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 border border-primary/20 text-primary">
                      {meal}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No bookings recorded for today.</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <Button className="w-full text-xs font-bold" variant="secondary" size="sm" onClick={() => setActivePage("Meal Booking")}>
              Manage Booking
            </Button>
          </CardFooter>
        </Card>

        {/* Notice Board */}
        <Card className="shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="text-primary h-5 w-5" /> Notices
            </CardTitle>
            <CardDescription>Announcements from Coordinator</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border/20 text-xs px-6">
              {data.notices.map((notice, idx) => (
                <li key={idx} className="py-2.5 text-muted-foreground leading-relaxed">
                  {notice}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Brief Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Your Monthly Footprint</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10 shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Meals Taken</CardDescription>
              <CardTitle className="text-3xl font-black">{data.yourStats.mealsTaken}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp size={12} className="text-primary" /> Active billing cycle entries
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Food Saved</CardDescription>
              <CardTitle className="text-3xl font-black">{data.yourStats.foodSaved.toFixed(1)} kg</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Estimated carbon reduction index</p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="pb-2">
              <CardDescription className="text-xs uppercase font-bold tracking-wider">Tickets Resolved</CardDescription>
              <CardTitle className="text-3xl font-black">{data.yourStats.complaintsResolved}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Complaints settled by admin desk</p>
            </CardContent>
          </Card>

        </div>
      </div>

    </div>
  );
};

// --- Menu View Subpage ---
const TodaysMenuSub = () => {
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${API_URL}/menu/${new Date().toISOString().split('T')[0]}`);
        if (!res.ok) throw new Error("Menu not found for this date.");
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

  if (loading) return <Skeleton className="h-64 w-full" />;
  if (error) return <div className="text-muted-foreground p-6 text-center">No menu available for today.</div>;

  return (
    <Card className="animate-page-enter page-enter-active">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="text-primary" /> Today's Serving Schedule
        </CardTitle>
        <CardDescription>{formatDate(menu.date)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="divide-y divide-border/30">
          <div className="py-4 flex justify-between items-center gap-4">
            <div className="font-bold text-foreground">🍳 Breakfast</div>
            <div className="text-muted-foreground text-sm">{menu.breakfast || "Not Available"}</div>
          </div>
          <div className="py-4 flex justify-between items-center gap-4">
            <div className="font-bold text-foreground">🍛 Lunch</div>
            <div className="text-muted-foreground text-sm">{menu.lunch || "Not Available"}</div>
          </div>
          <div className="py-4 flex justify-between items-center gap-4">
            <div className="font-bold text-foreground">🍽 Dinner</div>
            <div className="text-muted-foreground text-sm">{menu.dinner || "Not Available"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Booking Subpage ---
const MealBookingSub = ({ user }) => {
  const [meals, setMeals] = useState([]);
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
      showToast.error("Please log in to book meals.");
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
      if (!res.ok) throw new Error(data.error || "Failed to book meals.");
      showToast.success(data.message || "Meals booked successfully!");
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-page-enter page-enter-active max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarCheck className="text-primary" /> Daily Meal Planner
        </CardTitle>
        <CardDescription>Select serving segments you intend to consume today.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {["Breakfast", "Lunch", "Dinner"].map((meal) => (
            <label
              key={meal}
              className="flex items-center justify-between p-4 rounded-xl border border-border/60 bg-muted/10 cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all select-none"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  value={meal}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 accent-primary rounded cursor-pointer"
                />
                <span className="font-bold text-sm text-foreground">{meal} Serving</span>
              </div>
              <Clock size={16} className="text-muted-foreground" />
            </label>
          ))}
        </div>
        
        <Button onClick={handleBooking} disabled={loading || !user} className="w-full font-bold">
          {loading ? "Saving choices..." : "Confirm Daily Schedule"}
        </Button>
      </CardContent>
    </Card>
  );
};

// --- Feedback Subpage ---
const FeedbackPageSub = ({ user }) => {
  const [feedbackData, setFeedbackData] = useState({ name: '', email: '', rating: 5, feedback: '' });
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
      showToast.error("Please log in to submit feedback.");
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
      if (!res.ok) throw new Error(data.error || "Failed to submit feedback.");
      showToast.success(data.message || "Feedback submitted!");
      setFeedbackData(prev => ({ ...prev, rating: 5, feedback: '' }));
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-page-enter page-enter-active max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="text-primary" /> Service Feedback
        </CardTitle>
        <CardDescription>Rate your overall dining experience today.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
              <Input type="text" name="name" value={feedbackData.name} onChange={handleChange} required disabled />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase">Email</label>
              <Input type="email" name="email" value={feedbackData.email} onChange={handleChange} required disabled />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Quality Rating (1-5)</label>
            <Input
              type="number"
              name="rating"
              min="1"
              max="5"
              value={feedbackData.rating}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Detailed Comments</label>
            <Textarea
              name="feedback"
              value={feedbackData.feedback}
              onChange={handleChange}
              placeholder="Tell us what you liked or how we can improve..."
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full font-bold">
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// --- Complaints Subpage ---
const ComplaintsSub = ({ user }) => {
  const [complaintData, setComplaintData] = useState({ subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setComplaintData({ ...complaintData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast.error("Please log in to submit complaints.");
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
      if (!res.ok) throw new Error(data.error || "Failed to file complaint.");
      showToast.success(data.message || "Complaint filed!");
      setComplaintData({ subject: '', message: '' });
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-page-enter page-enter-active max-w-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="text-primary" /> Lodging Complaint Ticket
        </CardTitle>
        <CardDescription>File issues related to food hygiene, quantity, or delays.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Subject</label>
            <Input
              type="text"
              name="subject"
              value={complaintData.subject}
              onChange={handleChange}
              placeholder="e.g. Hygiene concerns on Friday lunch"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase">Complaint Description</label>
            <Textarea
              name="message"
              value={complaintData.message}
              onChange={handleChange}
              placeholder="Provide exact details regarding timings, servers, or plates..."
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full font-bold">
            {loading ? "Submitting Ticket..." : "Submit Complaint Ticket"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// --- Analytics Subpage ---
const AnalyticsSub = ({ user }) => {
  const [mealsByType, setMealsByType] = useState([]);
  const [complaintsStatus, setComplaintsStatus] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [sparklinesData, setSparklinesData] = useState({ bookingsTrend: [], mealsTrend: [], ticketsTrend: [] });
  const [stats, setStats] = useState({ totalBookings: 0, totalMeals: 0, totalComplaints: 0, resolvedComplaints: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const [bookingsRes, complaintsRes] = await Promise.all([
          fetch(`${API_URL}/bookings/${user._id}`),
          fetch(`${API_URL}/complaints/student/${user._id}`),
        ]);
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
        const complaints = complaintsRes.ok ? await complaintsRes.json() : [];

        // Sort bookings by date descending for recent logs
        const sortedBookings = [...bookings].sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentLogs(sortedBookings.slice(0, 5));

        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach(b => (b.meals || []).forEach(m => { if (mealsBy[m] !== undefined) mealsBy[m]++; }));
        setMealsByType([
          { label: 'Breakfast', value: mealsBy.Breakfast },
          { label: 'Lunch', value: mealsBy.Lunch },
          { label: 'Dinner', value: mealsBy.Dinner },
        ]);

        const compBy = { 'Pending': 0, 'In Progress': 0, 'Resolved': 0 };
        complaints.forEach(c => { if (compBy[c.status] !== undefined) compBy[c.status]++; });
        setComplaintsStatus([
          { label: 'Pending', value: compBy['Pending'] },
          { label: 'In Progress', value: compBy['In Progress'] },
          { label: 'Resolved', value: compBy['Resolved'] },
        ]);

        // Calculate stats
        const totalMeals = bookings.reduce((sum, b) => sum + (b.meals || []).length, 0);
        const resolved = complaints.filter(c => c.status === 'Resolved').length;
        setStats({
          totalBookings: bookings.length,
          totalMeals: totalMeals,
          totalComplaints: complaints.length,
          resolvedComplaints: resolved
        });

        // 7-Day Trend Calculations (ending today)
        const days = [...Array(7)].map((_, idx) => {
          const d = new Date();
          d.setDate(d.getDate() - (6 - idx));
          return d.toISOString().split("T")[0];
        });

        const weeklyMealsData = days.map(d => {
          const booking = bookings.find(b => b.date === d);
          return {
            label: d.split("-").slice(1).join("/"),
            value: booking ? (booking.meals || []).length : 0
          };
        });
        setWeeklyTrend(weeklyMealsData);

        // Generate Sparklines
        const bookingsSpark = days.map(d => bookings.some(b => b.date === d) ? 1 : 0);
        const mealsSpark = days.map(d => {
          const booking = bookings.find(b => b.date === d);
          return booking ? (booking.meals || []).length : 0;
        });
        const ticketsSpark = days.map(d => {
          return complaints.filter(c => new Date(c.createdAt).toISOString().split("T")[0] === d).length;
        });

        setSparklinesData({
          bookingsTrend: bookingsSpark,
          mealsTrend: mealsSpark,
          ticketsTrend: ticketsSpark
        });

      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 md:col-span-2" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-destructive font-bold p-6">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="text-primary" /> Personal Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track your dining footprints, meal reservation stats, and ticket resolutions.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-primary/30 hover:scale-[1.01] transition-all duration-300">
          <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Dining Logs</p>
                <h3 className="text-3xl font-extrabold text-foreground">{stats.totalBookings}</h3>
                <p className="text-[10px] text-muted-foreground font-semibold">Days with reserved slots</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/15 text-primary">
                <CalendarCheck size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/10">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">7d Activity</span>
              <Sparkline data={sparklinesData.bookingsTrend} strokeColor="var(--primary)" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-orange-500/30 hover:scale-[1.01] transition-all duration-300">
          <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Meals Reserved</p>
                <h3 className="text-3xl font-extrabold text-foreground">{stats.totalMeals}</h3>
                <p className="text-[10px] text-muted-foreground font-semibold">Total segmented servings</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/15 text-orange-500">
                <Utensils size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/10">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">7d Volume</span>
              <Sparkline data={sparklinesData.mealsTrend} strokeColor="#f97316" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-amber-500/30 hover:scale-[1.01] transition-all duration-300">
          <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tickets Resolved</p>
                <h3 className="text-3xl font-extrabold text-foreground">
                  {stats.resolvedComplaints} <span className="text-sm font-semibold text-muted-foreground">/ {stats.totalComplaints}</span>
                </h3>
                <p className="text-[10px] text-muted-foreground font-semibold">Resolved issues backlog</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-500">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/10">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">7d Lodges</span>
              <Sparkline data={sparklinesData.ticketsTrend} strokeColor="#fbbf24" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & History section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly consumption area chart */}
        <Card className="bg-card/20 border border-border/40 backdrop-blur-xs select-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp size={16} className="text-primary" /> Weekly Consumption Trend
            </CardTitle>
            <CardDescription>Number of meals booked daily (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <AreaChart data={weeklyTrend} height={200} strokeColor="var(--primary)" />
          </CardContent>
        </Card>

        {/* Right Column: Mini distribution summaries */}
        <div className="flex flex-col gap-6">
          <Card className="bg-card/20 border border-border/40 backdrop-blur-xs select-none flex-grow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Meals Booked By Segment</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <PremiumBarChart data={mealsByType} height={140} />
            </CardContent>
          </Card>

          <Card className="bg-card/20 border border-border/40 backdrop-blur-xs select-none flex-grow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Lodged Tickets Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <PremiumBarChart data={complaintsStatus} height={140} barColor="#fb923c" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card className="bg-card/20 border border-border/40 backdrop-blur-xs">
        <CardHeader>
          <CardTitle className="text-base">Recent Dining History</CardTitle>
          <CardDescription>Details of your latest meal bookings and segments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30">
                  <TableHead className="w-[140px] font-bold text-xs uppercase text-muted-foreground">Date</TableHead>
                  <TableHead className="font-bold text-xs uppercase text-muted-foreground">Segments Booked</TableHead>
                  <TableHead className="w-[140px] font-bold text-xs uppercase text-muted-foreground">Total Servings</TableHead>
                  <TableHead className="w-[140px] font-bold text-xs uppercase text-muted-foreground text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground text-sm">
                      No recent bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLogs.map((log) => {
                    const isPast = new Date(log.date) < new Date(new Date().toDateString());
                    return (
                      <TableRow key={log._id || log.id} className="border-border/20 hover:bg-muted/10 transition-colors">
                        <TableCell className="font-bold text-sm text-foreground">
                          {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {(log.meals || []).map((meal) => {
                              const colors = {
                                Breakfast: "bg-amber-500/10 border-amber-500/15 text-amber-500",
                                Lunch: "bg-primary/10 border-primary/15 text-primary",
                                Dinner: "bg-indigo-500/10 border-indigo-500/15 text-indigo-500"
                              };
                              return (
                                <span
                                  key={meal}
                                  className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${colors[meal] || "bg-muted text-muted-foreground"}`}
                                >
                                  {meal}
                                </span>
                              );
                            })}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-sm text-foreground">
                          {log.meals?.length || 0}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            isPast 
                              ? "bg-muted/30 border-border/30 text-muted-foreground"
                              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.1)]"
                          }`}>
                            {isPast ? "Completed" : "Scheduled"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Profile Subpage ---
const ProfileSub = ({ user }) => {
  if (!user) return <Skeleton className="h-48 w-full" />;

  return (
    <Card className="animate-page-enter page-enter-active max-w-xl">
      <CardHeader className="flex flex-row items-center gap-4 pb-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-3xl">
          🎓
        </div>
        <div>
          <CardTitle>{user.name}</CardTitle>
          <CardDescription>Student Resident profile</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="divide-y divide-border/20 text-sm">
          <div className="py-3 flex justify-between">
            <span className="text-muted-foreground font-semibold">Registered Email</span>
            <span className="font-bold text-foreground">{user.email}</span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-muted-foreground font-semibold">Account Status</span>
            <span className="font-bold text-emerald-500 flex items-center gap-1.5">
              <ShieldCheck size={14} /> Active Resident
            </span>
          </div>
          <div className="py-3 flex justify-between">
            <span className="text-muted-foreground font-semibold">Registered On</span>
            <span className="font-bold text-foreground">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// --- Main Student Dashboard Component ---
function SDashboard() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

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

        // enriquecimiento de perfil
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
        console.error('Failed to parse student session:', err);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('student');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary h-10 w-10" />
        <p className="text-muted-foreground text-sm font-bold">Synchronizing account...</p>
      </div>
    );
  }

  if (!user) return null;

  const sidebarItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: "Today's Menu", icon: <BookOpen size={18} /> },
    { name: 'Meal Booking', icon: <CalendarCheck size={18} /> },
    { name: 'Feedback', icon: <MessageSquare size={18} /> },
    { name: 'Complaints', icon: <AlertCircle size={18} /> },
    { name: 'Analytics', icon: <BarChart3 size={18} /> },
    { name: 'Profile', icon: <User size={18} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} setActivePage={setCurrentPage} />;
      case "Today's Menu":
        return <TodaysMenuSub />;
      case 'Meal Booking':
        return <MealBookingSub user={user} />;
      case 'Feedback':
        return <FeedbackPageSub user={user} />;
      case 'Complaints':
        return <ComplaintsSub user={user} />;
      case 'Analytics':
        return <AnalyticsSub user={user} />;
      case 'Profile':
        return <ProfileSub user={user} />;
      default:
        return <DashboardPage user={user} onLogout={handleLogout} setActivePage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-card/20 backdrop-blur-md p-6 fixed h-full left-0 top-0 z-40">
        <div className="pb-8 border-b border-border/40 mb-6 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-foreground">
            Mess<span className="text-primary">Mate</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-2 py-0.5 rounded-full bg-muted/40 border border-border/20">
            Student
          </span>
        </div>

        {/* Navigation list */}
        <nav className="flex-grow space-y-1.5">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setCurrentPage(item.name)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                currentPage === item.name
                  ? 'bg-primary/10 border-l-4 border-primary text-primary'
                  : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* User context footer */}
        <div className="pt-6 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/40 hover:bg-muted/40 text-foreground transition-all cursor-pointer"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className="text-xs text-muted-foreground font-semibold truncate max-w-[120px]">{user.name}</span>
          </div>
          <Button variant="destructive" size="sm" className="w-full gap-2 font-bold" onClick={handleLogout}>
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 w-full z-45 flex items-center justify-between bg-card/70 border-b border-border/40 backdrop-blur-md px-6 py-4">
        <span className="text-lg font-bold text-foreground">
          Mess<span className="text-primary">Mate</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-border/40 hover:bg-muted/40 text-foreground transition-all cursor-pointer"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted/40 rounded-xl text-foreground"
          >
            {mobileMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-md pt-20 px-6 flex flex-col justify-between pb-8">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setCurrentPage(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  currentPage === item.name
                    ? 'bg-primary/10 border-l-4 border-primary text-primary'
                    : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                }`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>
          <Button variant="destructive" className="w-full gap-2 font-bold" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </Button>
        </div>
      )}

      {/* Page Content Container */}
      <main className="flex-grow md:ml-64 p-6 md:p-12 pt-24 md:pt-12 max-w-7xl overflow-hidden">
        {renderPage()}
      </main>

    </div>
  );
}

export default SDashboard;
