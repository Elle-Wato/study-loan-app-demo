import { useState } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function FinancialSection({ onNext, onBack }) {
  const [financialDetails, setFinancialDetails] = useState({
    bankName: "",
    accountNumber: "",
    hasLoans: "",
    loanAmount: "",
    outstandingBalance: "",
    monthlyRepayment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinancialDetails({ ...financialDetails, [name]: value });
  };

  const handleNext = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save data.");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        { financialDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onNext();
    } catch (error) {
      console.error("Failed to save financial details:", error);
      alert("Failed to save financial details. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="E. Financial Details" className="fin-section">
      <div className="fin-grid">
        <input
          name="bankName"
          placeholder="🏦 Bank Name"
          value={financialDetails.bankName}
          onChange={handleChange}
          className="fin-input"
        />
        <input
          name="accountNumber"
          placeholder="🔢 Account Number"
          value={financialDetails.accountNumber}
          onChange={handleChange}
          className="fin-input"
        />
        <select
          name="hasLoans"
          value={financialDetails.hasLoans}
          onChange={handleChange}
          className="fin-select"
        >
          <option value="">❓ Any Bank Loans?</option>
          <option value="yes">✅ Yes</option>
          <option value="no">❌ No</option>
        </select>
        {financialDetails.hasLoans === "yes" && (
          <>
            <input
              name="loanAmount"
              placeholder="💰 Loan Amount"
              value={financialDetails.loanAmount}
              onChange={handleChange}
              className="fin-input"
            />
            <input
              name="outstandingBalance"
              placeholder="📊 Outstanding Balance"
              value={financialDetails.outstandingBalance}
              onChange={handleChange}
              className="fin-input"
            />
            <input
              name="monthlyRepayment"
              placeholder="📅 Monthly Repayment"
              value={financialDetails.monthlyRepayment}
              onChange={handleChange}
              className="fin-input"
            />
          </>
        )}
      </div>

      <div className="fin-buttons">
        <button onClick={handleBack} className="fin-button fin-button-back">
          ⬅️ Back
        </button>
        <button onClick={handleNext} className="fin-button fin-button-next">
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}