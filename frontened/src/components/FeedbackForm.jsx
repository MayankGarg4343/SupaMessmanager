import React, { useState } from "react";
import "../components/FeedbackForm.css";
import PixelBlast from "../components/PixelBlast";

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "",
    feedback: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        alert("Thank you for your feedback! 🙌");
        setFormData({
          name: "",
          email: "",
          rating: "",
          feedback: "",
        });
      } else {
        alert("Failed to send feedback.");
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="feedback-page">
      {/* Background effect */}
      <PixelBlast
        variant="circle"
        pixelSize={5}
        color="orange"
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

      {/* Feedback Form */}
      <div className="feedback-container">
        <div className="feedback-form">
          <h1>Feedback Form</h1>
          <p>We value your feedback! Help us improve your MessMate experience.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Rate Your Experience</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
              >
                <option value="">Select Rating</option>
                <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                <option value="4">⭐⭐⭐⭐ Good</option>
                <option value="3">⭐⭐⭐ Average</option>
                <option value="2">⭐⭐ Poor</option>
                <option value="1">⭐ Very Bad</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Your Feedback</label>
              <textarea
                name="feedback"
                placeholder="Write your feedback..."
                value={formData.feedback}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Feedback
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
