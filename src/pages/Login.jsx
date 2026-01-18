import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    navigate("/dashboard"); // redirect after login
  };

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
            >
              🔐 Login
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
          <p>&copy; 2023 Your Company. All rights reserved. | Contact Us: support@company.com</p>
        </footer>
      </div>
    </div>
  );
}