import React from "react";
import "../components/AboutUs.css";
import Navbar from "../components/Navbar";

const AboutUs = () => {
  return (
    <>
    <Navbar/>
      <div className="about-container">
        <section className="about-hero">
          <h1 style={{marginTop:"100px"}}>About Us</h1>
          <p style={{width:"100vw"}}>
            Our <span className="highlight">Mess Management System</span> is
            built to simplify dining operations, reduce food wastage, and ensure
            a smooth experience for both students and mess managers. It enables
            students to easily check daily menus, submit feedback, and raise
            complaints, while providing managers with powerful tools to plan
            resources, track inventory, and analyze consumption patterns. By
            combining technology with efficiency, we aim to create a
            transparent, sustainable, and student-friendly dining ecosystem that
            benefits everyone.
          </p>  
        </section>
        <section className="about-content">
          <div className="about-card">
            <img
              src="https://plus.unsplash.com/premium_photo-1661964290451-d42d10b0e575?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8WEg5Z0cyMTF6YWt8fGVufDB8fHx8fA%3D%3D%2C%5Bobject+Object%5D"
              alt="Our Mission"
            />
            <h2>Our Mission</h2>
            <p>
              To provide a transparent and efficient mess ecosystem where
              students can access menus, give feedback, and managers can
              optimize resources effectively.
            </p>
          </div>

          <div className="about-card">
            <img
              src="https://images.unsplash.com/photo-1624365033883-f8674a50a720?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8MzQ5MTA0OTZ8fGVufDB8fHx8fA%3D%3D%2C%5Bobject+Object%5D"
              alt="Our Vision"
            />
            <h2>Our Vision</h2>
            <p>
              We aim to create smart, sustainable, and student-friendly dining
              facilities by combining technology with everyday mess operations.
            </p>
          </div>

          <div className="about-card">
            <img
              src="https://images.unsplash.com/photo-1517971129774-8a2b38fa128e?w=294&dpr=2&h=294&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxjb2xsZWN0aW9uLXRodW1ibmFpbHx8OTk3ODk2Mnx8ZW58MHx8fHx8%2C%5Bobject+Object%5D"
              alt="Our Values"
            />
            <h2>Our Values</h2>
            <p>
              Efficiency, transparency, and student satisfaction drive us. Every
              meal counts, and so does every student's feedback.
            </p>
          </div>
        </section>
        <section className="about-extra">
          <h2>Who We Are</h2>
          <p>
            We are a team of passionate developers and mess coordinators who
            noticed the daily challenges in dining management. From food wastage
            to lack of proper feedback, our goal is to modernize and optimize
            the entire mess experience.
          </p>
        </section>
        <section className="about-extra">
          <h2>Key Features</h2>
          <p>
            Our system offers real-time menu updates, feedback tracking,
            complaint management, and data-driven analytics. This ensures not
            only a smoother operation but also a healthier and student-friendly
            dining culture.
          </p>
        </section>
        <section className="about-extra closing-note">
          <h2>Our Commitment</h2>
          <p>
            We are committed to building a future where mess management is
            <span className="highlight">
              {" "}
              smart, sustainable, and student-first
            </span>
            . Together, let’s redefine the dining experience.
          </p>
        </section>
      </div>
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <h2>Mess Management System</h2>
            <p>
              A smart solution to simplify dining operations, reduce food
              wastage, and improve the overall student experience. Our
              technology-driven approach ensures transparency and efficiency.
            </p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href="/">Home</a>
              </li>
              <li>
                <a href="/about">About Us</a>
              </li>
              <li>
                <a href="/contact">Contact</a>
              </li>
              <li>
                <a href="/faq">FAQs</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Our Services</h3>
            <ul>
              <li>
                <a href="#">Daily Menu Management</a>
              </li>
              <li>
                <a href="#">Student Feedback System</a>
              </li>
              <li>
                <a href="#">Analytics Dashboard</a>
              </li>
              <li>
                <a href="#">Complaint Handling</a>
              </li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: support@messmanager.com</p>
            <p>Phone: +91 98765 43210</p>
            <p>Location: Chitkara University, Punjab</p>
          </div>
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Instagram</a>
              <a href="#">LinkedIn</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Mess Management System. All Rights
            Reserved.
          </p>
        </div>
      </footer>
    </>
  );
};

export default AboutUs;
