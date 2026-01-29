import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // Install with: npm install axios
import logo from "../assets/logo.png";

const API_BASE_URL = "http://127.0.0.1:5000";  // Update to your deployed backend URL later

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Send login request to backend
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      }, {
  headers: {
    'Content-Type': 'application/json'
  }
});

      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 1000);  // Redirect to dashboard
    } catch (err) {
      // Handle errors (e.g., invalid credentials)
      setError(err.response?.data?.error || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  return (
    <div className="login-bg">
      <div className="page-container">
        <header className="login-header">
          <div className="header-content">
            <img src={logo} alt="Company Logo" className="header-logo" />
            <h1 className="header-title">Student Loan Portal</h1>
          </div>
          <div className="instructions">
            <h3>How to Apply for the Interest-Free Study Loan</h3>
            <p>Follow the steps below:</p>
            <ol>
              <li>Create your online account</li>
              <li>Login with your registered email and password</li>
              <li>Click "Apply" and provide all required information.</li>
            </ol>
            <p><strong>N.B.</strong></p>
            <ul>
              <li>If you are successful, you will be required to sign a contract with our lawyer and pay Ksh 2,500 for Undergraduate and UUSSP program, Kshs 5,000 for Postgraduate program and Kshs 1,500 for Diploma legal fees. The fee is payable only once.</li>
              <li>If you are successful, you will start paying back the loan at the end of the same month after the disbursement of the first semester fees.</li>
              <li>Fees will be directly transferred to the university account.</li>
              <li>The bank charges for the transfer will form part of the soft loan and charged to the account of the successful applicant.</li>
            </ul>
          </div>
        </header>
        <div className="login-card">
          <h2 className="login-title">
            Student Login
          </h2>

          {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
          {success && <p className="success-message" style={{ color: "green" }}>{success}</p>}

          <form onSubmit={handleLogin} className="login-form">
            <div>
              <label className="login-label">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="login-input"
              />
            </div>

            <div>
              <label className="login-label">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="login-input"
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? "🔐 Logging in..." : "🔐 Login"}
            </button>
          </form>

          <p className="login-footer">
            Don’t have an account?{" "}
            <span
              className="login-link"
              onClick={() => navigate("/register")}
            >
              📝 Create Account
            </span>
          </p>
        </div>
        <footer className="page-footer">
          <p>&copy; {currentYear} Elimisha Trust. All rights reserved. | Contact Us: applications@elimishatrust.or.ke </p>
        </footer>
      </div>
    </div>
  );
}