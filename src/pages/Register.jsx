import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/logo.png";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // DEMO ONLY – later send to backend
    console.log("Registered user:", formData);

    navigate("/"); // back to login
  };

  return (
    <div className="reg-bg">
      <div className="reg-card">
        <img src={logo} alt="Company Logo" className="reg-logo" /> 
        <h2 className="reg-title">
          📝 Create Student Account
        </h2>

        <form onSubmit={handleSubmit} className="reg-form">
          <div>
            <label className="reg-label">👤 Full Name</label>
            <input
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="reg-input"
            />
          </div>

          <div>
            <label className="reg-label">📧 Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="reg-input"
            />
          </div>

          <div>
            <label className="reg-label">🔒 Password</label>
            <input
              name="password"
              type="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              className="reg-input"
            />
          </div>

          <div>
            <label className="reg-label">🔒 Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="reg-input"
            />
          </div>

          <button
            type="submit"
            className="reg-button"
          >
            📝 Create Account
          </button>
        </form>

        <p className="reg-footer">
          Already have an account?{" "}
          <span
            className="reg-link"
            onClick={() => navigate("/")}
          >
            🔐 Login
          </span>
        </p>
      </div>
    </div>
  );
}