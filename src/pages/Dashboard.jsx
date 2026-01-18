import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dash-bg">
      <div className="dash-card">
        <img src={logo} alt="Company Logo" className="login-logo" />
        <h2 className="dash-title">
          🎓 Welcome to Study Loan Portal
        </h2>
        <p className="dash-text">
          Ready to apply for your student loan? Click below to get started!
        </p>
        <button
          onClick={() => navigate("/apply")}
          className="dash-button"
        >
          📝 Apply for Loan
        </button>
      </div>
    </div>
  );
}