import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../utils/ThemeContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { AreaChart, PremiumBarChart, Sparkline } from "../components/ui/chart";
import { Skeleton } from "../components/ui/skeleton";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { showToast } from "../utils/toast";
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  MessageSquare,
  AlertCircle,
  BarChart3,
  Users,
  Settings as SettingsIcon,
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
  Trash2,
  Save,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Calendar,
  Star,
  Info
} from "lucide-react";
import { API_URL } from "../config";

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Star renderer helper for feedback ratings
const renderStars = (rating) => {
  const stars = [];
  const num = Math.round(Number(rating || 5));
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Star
        key={i}
        size={14}
        className={i <= num ? "text-amber-500 fill-amber-500 animate-pulse-glow" : "text-muted-foreground/30"}
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

// --- Subpage: DashboardPage (Overview) ---
const DashboardPage = ({ setActivePage, onLogout }) => {
  const [analyticsDate, setAnalyticsDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState({
    totalStudents: 0,
    activeComplaints: 0,
    feedbackReceived: 0,
    mealsBooked: 0,
    recentUpdates: [],
    mealsByType: [
      { label: "Breakfast", value: 0 },
      { label: "Lunch", value: 0 },
      { label: "Dinner", value: 0 },
    ],
  });
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsRes, complaintsRes, feedbackRes, bookingsRes] =
          await Promise.all([
            fetch(`${API_URL}/students`),
            fetch(`${API_URL}/complaints`),
            fetch(`${API_URL}/feedback`),
            fetch(`${API_URL}/bookings/daily/${analyticsDate}`),
          ]);

        if (
          !studentsRes.ok ||
          !complaintsRes.ok ||
          !feedbackRes.ok ||
          !bookingsRes.ok
        ) {
          throw new Error("Failed to fetch dashboard overview metrics.");
        }

        const students = await studentsRes.json();
        const complaints = await complaintsRes.json();
        const feedback = await feedbackRes.json();
        const bookings = await bookingsRes.json();

        const activeComplaintsCount = complaints.filter(
          (c) => c.status !== "Resolved"
        ).length;
        const mealsBookedCount = bookings.reduce(
          (sum, booking) => sum + (booking.meals?.length || 0),
          0
        );

        // Analytics distributions for today
        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach((b) =>
          (b.meals || []).forEach((m) => {
            if (mealsBy[m] !== undefined) mealsBy[m]++;
          })
        );

        // Recent Updates logs
        const recentComplaints = complaints
          .slice(0, 2)
          .map((c) => `New complaint filed: "${c.subject}"`);
        const recentFeedback = feedback
          .slice(0, 2)
          .map((f) => `New student feedback: "${f.feedback.substring(0, 30)}..."`);
        const recentUpdates = [...recentComplaints, ...recentFeedback].sort(
          () => 0.5 - Math.random()
        );

        setData({
          totalStudents: students.length,
          activeComplaints: activeComplaintsCount,
          feedbackReceived: feedback.length,
          mealsBooked: mealsBookedCount,
          recentUpdates,
          mealsByType: [
            { label: "Breakfast", value: mealsBy.Breakfast },
            { label: "Lunch", value: mealsBy.Lunch },
            { label: "Dinner", value: mealsBy.Dinner },
          ],
        });

        // Fetch last 7 days of trends
        const base = new Date(analyticsDate);
        const days = [...Array(7)].map((_, idx) => {
          const d = new Date(base);
          d.setDate(base.getDate() - (6 - idx));
          return d.toISOString().split("T")[0];
        });
        const responses = await Promise.all(
          days.map((d) => fetch(`${API_URL}/bookings/daily/${d}`))
        );
        const jsons = await Promise.all(
          responses.map((r) => (r.ok ? r.json() : []))
        );
        const totals = jsons.map((list) =>
          list.reduce((sum, b) => sum + (b.meals?.length || 0), 0)
        );
        setWeeklyMeals(days.map((d, i) => ({ label: d.split("-").slice(1).join("/"), value: totals[i] })));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analyticsDate]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-14 w-1/3" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-72 lg:col-span-2" />
          <Skeleton className="h-72" />
        </div>
      </div>
    );
  }

  if (error) return <div className="text-destructive font-bold p-6">Error loading overview: {error}</div>;

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            Welcome, Admin <Sparkles className="text-primary h-6 w-6" />
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Overview of student listings, dining activities, complaints tracking, and daily servings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="date"
              value={analyticsDate}
              onChange={(e) => setAnalyticsDate(e.target.value)}
              className="h-10 text-xs w-[160px] pl-8"
            />
            <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button variant="destructive" size="sm" onClick={onLogout} className="gap-2">
            <LogOut size={14} /> Logout
          </Button>
        </div>
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:border-primary/30 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Total Residents</CardDescription>
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/10 text-blue-500">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-black">{data.totalStudents}</h2>
            <p className="text-xs text-muted-foreground mt-1">Registered Student Profiles</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Pending Tickets</CardDescription>
            <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/10 text-red-500">
              <AlertTriangle size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-black">{data.activeComplaints}</h2>
            <p className="text-xs text-muted-foreground mt-1">Awaiting Resolution Desk</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Reviews Logged</CardDescription>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/10 text-amber-500">
              <Star size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-black">{data.feedbackReceived}</h2>
            <p className="text-xs text-muted-foreground mt-1">Submitted Quality Ratings</p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/30 transition-all">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardDescription className="text-xs uppercase font-bold tracking-wider">Meals Secured</CardDescription>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10 text-emerald-500">
              <CalendarCheck size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-3xl font-black">{data.mealsBooked}</h2>
            <p className="text-xs text-muted-foreground mt-1">Total bookings for {analyticsDate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Live Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp size={18} className="text-primary" /> Meals Distribution Trend
            </CardTitle>
            <CardDescription>Estimated booking load over the last 7 active days</CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <AreaChart data={weeklyMeals} height={200} strokeColor="var(--primary)" />
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info size={18} className="text-primary" /> Recent Log Updates
            </CardTitle>
            <CardDescription>Live operations activity ticker</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow pt-4">
            <ul className="space-y-3">
              {data.recentUpdates.length > 0 ? (
                data.recentUpdates.map((update, index) => (
                  <li
                    key={index}
                    className="p-3 text-xs rounded-xl bg-muted/30 border border-border/20 text-muted-foreground leading-relaxed flex items-start gap-2 hover:bg-muted/50 transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <span>{update}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted-foreground text-center py-8">No recent log modifications.</li>
              )}
            </ul>
          </CardContent>
          <CardFooter className="pt-2">
            <Button className="w-full text-xs font-bold" variant="secondary" size="sm" onClick={() => setActivePage("Complaints")}>
              Review Complaint Desk
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// --- Subpage: ManageMenu ---
const ManageMenu = () => {
  const [menu, setMenu] = useState({
    date: new Date().toISOString().split("T")[0],
    breakfast: "",
    lunch: "",
    dinner: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const fetchMenu = async (date) => {
    if (!date) return;
    try {
      setLoadingMenu(true);
      const res = await fetch(`${API_URL}/menu/${date}`);
      if (!res.ok) {
        throw new Error("No menu uploaded yet for this date.");
      }
      const data = await res.json();
      setMenu({
        date: new Date(data.date).toISOString().split("T")[0],
        breakfast: data.breakfast || "",
        lunch: data.lunch || "",
        dinner: data.dinner || "",
      });
      showToast.success("Loaded current menu details.");
    } catch (err) {
      setMenu({ date, breakfast: "", lunch: "", dinner: "" });
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    fetchMenu(menu.date);
  }, []);

  const handleChange = (e) => {
    setMenu({ ...menu, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(menu),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save menu changes.");
      }
      showToast.success(data.message || "Menu schedule saved!");
    } catch (err) {
      showToast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <BookOpen className="text-primary" /> Daily Menu Planner
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Draft or update meals served in each category. Select a date to inspect existing plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Helper Sidecard */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Scheduling Rules</CardTitle>
            <CardDescription>Mess operation regulations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Please enter clear, descriptive dishes (e.g. "Paneer Masala & Tandoori Roti").
            </p>
            <p>
              Students rely on updates to schedule bookings. Ensure details are correct by <strong>8:00 PM</strong> of the preceding evening.
            </p>
            <div className="p-3 bg-card rounded-xl border border-border/30 flex items-center gap-3 text-xs">
              <Clock size={16} className="text-primary" />
              <span>Current Server Time: {new Date().toLocaleTimeString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Input Form Card */}
        <Card className="lg:col-span-2 shadow-2xl">
          <CardHeader>
            <CardTitle>Define Serve Items</CardTitle>
            <CardDescription>Select calendar slot and fill recipe cards</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingMenu ? (
              <div className="space-y-4 py-8">
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
                <Skeleton className="h-10" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Target Date</label>
                  <div className="relative">
                    <Input
                      type="date"
                      name="date"
                      value={menu.date}
                      onChange={handleChange}
                      required
                      onBlur={(e) => fetchMenu(e.target.value)}
                      className="pl-10"
                    />
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🍳 Breakfast Schedule</label>
                  <Input
                    type="text"
                    name="breakfast"
                    value={menu.breakfast}
                    onChange={handleChange}
                    placeholder="e.g. Idli Sambhar, Tea, Fruits"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🍛 Lunch Menu</label>
                  <Input
                    type="text"
                    name="lunch"
                    value={menu.lunch}
                    onChange={handleChange}
                    placeholder="e.g. Rajma Chawal, Roti, Curd, Salad"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">🍽 Dinner Menu</label>
                  <Input
                    type="text"
                    name="dinner"
                    value={menu.dinner}
                    onChange={handleChange}
                    placeholder="e.g. Paneer Butter Masala, Butter Naan, Kheer"
                    required
                  />
                </div>

                <Button type="submit" className="w-full font-bold pt-1" disabled={loading}>
                  {loading ? "Publishing Schedule..." : "Save & Publish Menu"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Subpage: MealBookings ---
const MealBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
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

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <CalendarCheck className="text-primary" /> Daily Bookings Register
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Check student bookings for a selected date. Tracks specific segments.
          </p>
        </div>
        <div className="relative">
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-10 text-xs w-[160px] pl-8"
          />
          <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Student Reservations</CardTitle>
            <CardDescription>Daily record sheet for Campus Mess Hall</CardDescription>
          </div>
          <div className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            Total Bookings: {bookings.length}
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {loading ? (
            <div className="space-y-3 py-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-destructive font-semibold p-4 text-center">Error listing bookings: {error}</div>
          ) : bookings.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Resident</TableHead>
                  <TableHead>Meals Claimed</TableHead>
                  <TableHead>Register Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking._id} className="hover:bg-muted/10">
                    <TableCell className="font-semibold">
                      {booking.studentId ? (
                        <div className="flex flex-col">
                          <span>{booking.studentId.name}</span>
                          <span className="text-xs font-normal text-muted-foreground">{booking.studentId.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Anonymous Student</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {booking.meals && booking.meals.length > 0 ? (
                          booking.meals.map((meal) => (
                            <span key={meal} className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary uppercase">
                              {meal}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground italic">None Booked</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {new Date(booking.createdAt).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground text-center py-12">
              <Info className="mx-auto h-8 w-8 opacity-40 mb-3" />
              <p className="text-sm font-semibold">No bookings recorded for this date.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// --- Subpage: Feedback ---
const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch(`${API_URL}/feedback`);
        if (!res.ok) {
          throw new Error("Failed to fetch feedback logs.");
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

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <MessageSquare className="text-primary" /> Student Reviews Feed
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review comments and daily stars submitted by student diners.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
          <Skeleton className="h-44" />
        </div>
      ) : error ? (
        <div className="text-destructive font-bold p-6">Error loading feedback: {error}</div>
      ) : feedbackList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {feedbackList.map((feedback) => (
            <Card key={feedback._id} className="hover:border-primary/30 transition-all flex flex-col justify-between">
              <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-base font-bold">{feedback.name}</CardTitle>
                  <CardDescription className="text-xs">{feedback.email}</CardDescription>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-muted/60 border border-border/30 flex items-center gap-1.5">
                  <span className="text-xs font-black">{feedback.rating}</span>
                  {renderStars(feedback.rating)}
                </div>
              </CardHeader>
              <CardContent className="flex-grow pt-2">
                <p className="text-sm text-foreground/80 leading-relaxed italic bg-muted/10 p-3 rounded-xl border border-border/10">
                  "{feedback.feedback}"
                </p>
              </CardContent>
              <CardFooter className="pt-2 pb-4 text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <Clock size={12} /> Received: {formatDate(feedback.createdAt)}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <CardContent className="space-y-3">
            <Info className="mx-auto h-8 w-8 text-muted-foreground opacity-40" />
            <h3 className="text-sm font-semibold text-muted-foreground">No review entries received yet.</h3>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// --- Subpage: Complaints ---
const Complaints = () => {
  const [complaintList, setComplaintList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await fetch(`${API_URL}/complaints`);
      if (!res.ok) {
        throw new Error("Failed to fetch complaint registry.");
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        throw new Error("Failed to update ticket status.");
      }
      showToast.success(`Ticket status updated to "${newStatus}"`);
      fetchComplaints();
    } catch (err) {
      console.error(err);
      showToast.error(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : "";
    if (s === "resolved") {
      return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    }
    if (s === "in progress") {
      return "bg-blue-500/10 border-blue-500/20 text-blue-500";
    }
    return "bg-amber-500/10 border-amber-500/20 text-amber-500";
  };

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <AlertCircle className="text-primary" /> Complaints & Issues Registry
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Lodge responses and toggle resolution statuses for reported dining hall difficulties.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <Skeleton className="h-36 w-full" />
          <Skeleton className="h-36 w-full" />
        </div>
      ) : error ? (
        <div className="text-destructive font-bold p-6">Error loading complaints: {error}</div>
      ) : complaintList.length > 0 ? (
        <div className="space-y-6">
          {complaintList.map((complaint) => (
            <Card key={complaint._id} className="hover:border-primary/20 transition-all">
              <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(complaint.status)}`}>
                    {complaint.status || "Pending"}
                  </span>
                  <CardTitle className="text-lg font-bold pt-1.5">{complaint.subject}</CardTitle>
                  <CardDescription className="text-xs">
                    Submitted by: {complaint.name || "Anonymous Resident"} ({complaint.email || "No Email"})
                  </CardDescription>
                </div>
                <div className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1.5">
                  <Clock size={12} /> Filed: {formatDate(complaint.createdAt)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/80 leading-relaxed bg-muted/10 p-4 rounded-xl border border-border/20">
                  {complaint.message}
                </p>
              </CardContent>
              <CardFooter className="flex flex-wrap items-center justify-between gap-3 pt-3">
                <span className="text-xs text-muted-foreground font-medium">Update resolution status:</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatus(complaint._id, "Pending")}
                    variant={complaint.status === "Pending" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Pending
                  </Button>
                  <Button
                    onClick={() => updateStatus(complaint._id, "In Progress")}
                    variant={complaint.status === "In Progress" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    In Progress
                  </Button>
                  <Button
                    onClick={() => updateStatus(complaint._id, "Resolved")}
                    variant={complaint.status === "Resolved" ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                  >
                    Resolved
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center">
          <CardContent className="space-y-3">
            <CheckCircle className="mx-auto h-8 w-8 text-emerald-500 animate-bounce" />
            <h3 className="text-sm font-semibold text-muted-foreground">All clear! No student complaints on record.</h3>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// --- Subpage: Analytics ---
const Analytics = () => {
  const [analyticsDate, setAnalyticsDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [data, setData] = useState({
    mealsByType: [
      { label: "Breakfast", value: 0 },
      { label: "Lunch", value: 0 },
      { label: "Dinner", value: 0 },
    ],
    ratingsDist: [
      { label: "1★", value: 0 },
      { label: "2★", value: 0 },
      { label: "3★", value: 0 },
      { label: "4★", value: 0 },
      { label: "5★", value: 0 },
    ],
    complaintsStatus: [
      { label: "Pending", value: 0 },
      { label: "In Progress", value: 0 },
      { label: "Resolved", value: 0 },
    ],
  });
  const [weeklyMeals, setWeeklyMeals] = useState([]);
  const [weeklyComplaints, setWeeklyComplaints] = useState([]);
  const [weeklyFeedback, setWeeklyFeedback] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalBookingsToday: 0,
    avgSatisfaction: "0.0",
    activeTickets: 0,
  });
  const [activeTrendTab, setActiveTrendTab] = useState("meals");
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

        const complaints = complaintsRes.ok ? await complaintsRes.json() : [];
        const feedback = feedbackRes.ok ? await feedbackRes.json() : [];
        const bookings = bookingsRes.ok ? await bookingsRes.json() : [];

        // Calculate distribution for selected date
        const mealsBy = { Breakfast: 0, Lunch: 0, Dinner: 0 };
        bookings.forEach((b) =>
          (b.meals || []).forEach((m) => {
            if (mealsBy[m] !== undefined) mealsBy[m]++;
          })
        );

        const ratingsBy = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        feedback.forEach((f) => {
          const r = Number(f.rating);
          if (ratingsBy[r] !== undefined) ratingsBy[r]++;
        });

        const compBy = { Pending: 0, "In Progress": 0, Resolved: 0 };
        complaints.forEach((c) => {
          if (compBy[c.status] !== undefined) compBy[c.status]++;
        });

        setData({
          mealsByType: [
            { label: "Breakfast", value: mealsBy.Breakfast },
            { label: "Lunch", value: mealsBy.Lunch },
            { label: "Dinner", value: mealsBy.Dinner },
          ],
          ratingsDist: [
            { label: "1★", value: ratingsBy[1] },
            { label: "2★", value: ratingsBy[2] },
            { label: "3★", value: ratingsBy[3] },
            { label: "4★", value: ratingsBy[4] },
            { label: "5★", value: ratingsBy[5] },
          ],
          complaintsStatus: [
            { label: "Pending", value: compBy["Pending"] },
            { label: "In Progress", value: compBy["In Progress"] },
            { label: "Resolved", value: compBy["Resolved"] },
          ],
        });

        // Weekly trends ending at selected date
        const base = new Date(analyticsDate);
        const days = [...Array(7)].map((_, idx) => {
          const d = new Date(base);
          d.setDate(base.getDate() - (6 - idx));
          return d.toISOString().split("T")[0];
        });

        const responses = await Promise.all(
          days.map((d) => fetch(`${API_URL}/bookings/daily/${d}`))
        );
        const jsons = await Promise.all(
          responses.map((r) => (r.ok ? r.json() : []))
        );
        const totals = jsons.map((list) =>
          list.reduce((sum, b) => sum + (b.meals?.length || 0), 0)
        );
        
        const mappedWeeklyMeals = days.map((d, i) => ({ label: d.split("-").slice(1).join("/"), value: totals[i] || 0 }));
        setWeeklyMeals(mappedWeeklyMeals);

        const compTotals = days.map(
          (d) =>
            complaints.filter(
              (c) => new Date(c.createdAt).toISOString().split("T")[0] === d
            ).length
        );
        const mappedWeeklyComplaints = days.map((d, i) => ({ label: d.split("-").slice(1).join("/"), value: compTotals[i] }));
        setWeeklyComplaints(mappedWeeklyComplaints);

        const feedTotals = days.map(
          (d) =>
            feedback.filter(
              (f) => new Date(f.createdAt).toISOString().split("T")[0] === d
            ).length
        );
        const mappedWeeklyFeedback = days.map((d, i) => ({ label: d.split("-").slice(1).join("/"), value: feedTotals[i] }));
        setWeeklyFeedback(mappedWeeklyFeedback);

        // Summary Calculations
        const totalMealsToday = mealsBy.Breakfast + mealsBy.Lunch + mealsBy.Dinner;
        const totalRating = feedback.reduce((sum, f) => sum + Number(f.rating), 0);
        const avgSatisfaction = feedback.length ? (totalRating / feedback.length).toFixed(1) : "0.0";
        const activeTicketsCount = complaints.filter(c => c.status !== "Resolved").length;

        setSummaryStats({
          totalBookingsToday: totalMealsToday,
          avgSatisfaction,
          activeTickets: activeTicketsCount,
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [analyticsDate]);

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <BarChart3 className="text-primary" /> Operations Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Detailed histograms, trends, and activity indexes. Filters historical logs.
          </p>
        </div>
        <div className="relative">
          <Input
            type="date"
            value={analyticsDate}
            onChange={(e) => setAnalyticsDate(e.target.value)}
            className="h-10 text-xs w-[160px] pl-8"
          />
          <Calendar size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      ) : (
        <>
          {/* KPI Dashboard row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-primary/30 hover:scale-[1.01] transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Bookings Today</p>
                    <h3 className="text-3xl font-extrabold text-foreground">{summaryStats.totalBookingsToday}</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Total meal bookings</p>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 border border-primary/15 text-primary">
                    <CalendarCheck size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">7d Trend</span>
                  <Sparkline data={weeklyMeals.map(m => m.value)} strokeColor="var(--primary)" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-amber-500/30 hover:scale-[1.01] transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Average Satisfaction</p>
                    <h3 className="text-3xl font-extrabold text-foreground">{summaryStats.avgSatisfaction} <span className="text-sm font-semibold text-muted-foreground">/ 5.0</span></h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Based on student feedback</p>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/15 text-amber-500">
                    <Star size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Feedback Volume</span>
                  <Sparkline data={weeklyFeedback.map(f => f.value)} strokeColor="#fbbf24" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-red-500/30 hover:scale-[1.01] transition-all duration-300">
              <CardContent className="p-6 flex flex-col justify-between h-full gap-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Active Complaints</p>
                    <h3 className="text-3xl font-extrabold text-foreground">{summaryStats.activeTickets}</h3>
                    <p className="text-[10px] text-muted-foreground font-semibold">Unresolved student tickets</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/15 text-red-500">
                    <AlertTriangle size={20} />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border/10">
                  <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Complaints Velocity</span>
                  <Sparkline data={weeklyComplaints.map(c => c.value)} strokeColor="#ef4444" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Unified Trend Telemetry Hub */}
          <Card className="bg-card/20 border border-border/40 backdrop-blur-xs select-none">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp size={16} className="text-primary" /> Operations Trends
                </CardTitle>
                <CardDescription>7-day operations activity tracking</CardDescription>
              </div>
              <div className="flex bg-muted/40 p-1 rounded-xl border border-border/40 w-fit">
                {[
                  { id: "meals", label: "Meals Volume", color: "var(--primary)" },
                  { id: "complaints", label: "Complaints", color: "#ef4444" },
                  { id: "feedback", label: "Feedback Log", color: "#fbbf24" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTrendTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      activeTrendTab === tab.id
                        ? "bg-background text-foreground shadow-sm border border-border/20"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tab.color }}></span>
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              {activeTrendTab === "meals" && (
                <AreaChart data={weeklyMeals} height={220} strokeColor="var(--primary)" />
              )}
              {activeTrendTab === "complaints" && (
                <AreaChart data={weeklyComplaints} height={220} strokeColor="#ef4444" />
              )}
              {activeTrendTab === "feedback" && (
                <AreaChart data={weeklyFeedback} height={220} strokeColor="#fbbf24" />
              )}
            </CardContent>
          </Card>

          {/* Distribution Histograms - centered long bars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-primary/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Meals Secured Today</CardTitle>
                <CardDescription>Daily division totals</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <PremiumBarChart data={data.mealsByType} height={160} barColor="var(--primary)" />
              </CardContent>
            </Card>

            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-amber-500/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Feedback Ratings</CardTitle>
                <CardDescription>Cumulative review index</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <PremiumBarChart data={data.ratingsDist} height={160} barColor="#fbbf24" />
              </CardContent>
            </Card>

            <Card className="bg-card/25 border border-border/40 backdrop-blur-xs select-none hover:border-blue-500/20 transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Complaint Segments</CardTitle>
                <CardDescription>Registry index states</CardDescription>
              </CardHeader>
              <CardContent className="pb-6">
                <PremiumBarChart data={data.complaintsStatus} height={160} barColor="#3b82f6" />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

// --- Subpage: UserManagement ---
const UserManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/students`);
      if (!res.ok) {
        throw new Error("Failed to fetch students from registry.");
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

  const initiateDelete = (id) => {
    setStudentToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;
    try {
      const res = await fetch(`${API_URL}/students/${studentToDelete}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete user profile.");
      }
      setStudents(students.filter((student) => student._id !== studentToDelete));
      showToast.success("Student registration cancelled.");
    } catch (err) {
      console.error(err);
      showToast.error(err.message || "Failed to remove resident.");
    } finally {
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="border-b border-border/40 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="text-primary" /> Resident Profiles Directory
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Register, search, and manage credentials for campus dining residents.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Diner Registrations</CardTitle>
          <CardDescription>Authoritative accounts index of residents</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {loading ? (
            <div className="space-y-3 py-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : error ? (
            <div className="text-destructive font-semibold p-4 text-center">Error listing students: {error}</div>
          ) : students.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resident Name</TableHead>
                  <TableHead>Email Credentials</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student._id} className="hover:bg-muted/10">
                    <TableCell className="font-semibold text-foreground">{student.name}</TableCell>
                    <TableCell className="text-muted-foreground">{student.email}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{formatDate(student.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => initiateDelete(student._id)}
                        className="gap-1.5 py-1 px-3 text-xs"
                      >
                        <Trash2 size={12} /> Cancel Access
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-muted-foreground text-center py-12">
              <Info className="mx-auto h-8 w-8 opacity-40 mb-3" />
              <p className="text-sm font-semibold">No students registered yet in system.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-destructive" /> Revoke Account Access?
          </DialogTitle>
          <DialogDescription>
            This action is irreversible. The student will lose all historical reservation registries, lodged complaints, and access keys.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
            Keep Active
          </Button>
          <Button variant="destructive" onClick={confirmDelete}>
            Revoke Access
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

// --- Subpage: Settings ---
const Settings = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("adminSettings");
    return saved
      ? JSON.parse(saved)
      : {
          messName: "Campus Hall Alpha",
          adminEmail: "operations@messmate.com",
          enableNotifications: true,
          maintenanceMode: false,
        };
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("adminSettings", JSON.stringify(settings));
    showToast.success("Local administrative config saved!");
  };

  return (
    <div className="space-y-8 animate-page-enter page-enter-active">
      <div className="border-b border-border/40 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-2">
          <SettingsIcon className="text-primary" /> Operation Config
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Adjust administrative settings for local operations. Values stored locally.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Info card */}
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="text-primary" /> Security Clearance
            </CardTitle>
            <CardDescription>Account access clearance level 1</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Modifications saved directly inside your browser cache.
            </p>
            <p>
              Toggling <strong>Maintenance Mode</strong> restricts students from booking new daily segments.
            </p>
          </CardContent>
        </Card>

        {/* Settings form */}
        <Card className="lg:col-span-2 shadow-2xl">
          <CardHeader>
            <CardTitle>Administrative Settings</CardTitle>
            <CardDescription>Update name identifiers and active features</CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hall Operation Identifier</label>
                <Input
                  type="text"
                  name="messName"
                  value={settings.messName}
                  onChange={handleChange}
                  placeholder="e.g. SupaMess Main Hall"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Primary Operations Desk Email</label>
                <Input
                  type="email"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@messmate.com"
                  required
                />
              </div>

              <div className="space-y-4 border-t border-border/20 pt-4">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Alert Notification Mails</span>
                    <span className="text-xs text-muted-foreground">Notify ops desk on new filed complaints</span>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none pt-2">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-foreground">Active Maintenance Mode</span>
                    <span className="text-xs text-muted-foreground">Restrict student log-ins and meal bookings</span>
                  </div>
                </label>
              </div>

              <Button type="submit" className="w-full font-bold gap-2">
                <Save size={16} /> Save Admin Settings
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Main ADashboard Wrapper ---
function Adashboard() {
  const [currentPage, setCurrentPage] = useState("Dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Validate admin token presence
  useEffect(() => {
    const token = localStorage.getItem("token");
    // If not authenticated, redirect to login page (since in the codebase admins also use the credentials token)
    // Wait, the project doesn't have an admin login page but we navigate here directly. If they logout, we clear localstorage.
    // Let's support basic redirect.
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("student"); // clear student
    showToast.success("Logged out successfully.");
    navigate("/");
  };

  const sidebarItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Manage Menu", icon: <BookOpen size={18} /> },
    { name: "Meal Bookings", icon: <CalendarCheck size={18} /> },
    { name: "Feedback", icon: <MessageSquare size={18} /> },
    { name: "Complaints", icon: <AlertCircle size={18} /> },
    { name: "Analytics", icon: <BarChart3 size={18} /> },
    { name: "User Management", icon: <Users size={18} /> },
    { name: "Settings", icon: <SettingsIcon size={18} /> },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case "Dashboard":
        return <DashboardPage setActivePage={setCurrentPage} onLogout={handleLogout} />;
      case "Manage Menu":
        return <ManageMenu />;
      case "Meal Bookings":
        return <MealBookings />;
      case "Feedback":
        return <Feedback />;
      case "Complaints":
        return <Complaints />;
      case "Analytics":
        return <Analytics />;
      case "User Management":
        return <UserManagement />;
      case "Settings":
        return <Settings />;
      default:
        return <DashboardPage setActivePage={setCurrentPage} onLogout={handleLogout} />;
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
            Admin
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
                  ? "bg-primary/10 border-l-4 border-primary text-primary"
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* Theme Toggler and Logout Footer */}
        <div className="pt-6 border-t border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border/40 hover:bg-muted/40 text-foreground transition-all cursor-pointer"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className="text-xs text-muted-foreground font-semibold truncate max-w-[120px]">Desk Admin</span>
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
                    ? "bg-primary/10 border-l-4 border-primary text-primary"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
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

export default Adashboard;
