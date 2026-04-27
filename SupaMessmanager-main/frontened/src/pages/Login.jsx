import { useState } from "react";
import PixelBlast from "../components/PixelBlast";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../components/Login.css";
import { showToast } from "../utils/toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      console.log(response);

      if (response.data.success) {
        // Stores the student and JWT token returned from the backend
        localStorage.setItem("student", JSON.stringify(response.data.student));
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        }
        showToast.success("Login successful! Redirecting to dashboard.");
        navigate("/dashboard");
      } else {
        showToast.error(response.data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast.error("Something went wrong. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="login-page">
        <PixelBlast
          variant="circle"
          pixelSize={10}
          color="white"
          patternScale={10}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
            background: "black",
          }}
        />

        <div className="login-form-container">
          <h2 className="login-title">
            Student Portal - Login
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="signup-link">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </>
  );
}
