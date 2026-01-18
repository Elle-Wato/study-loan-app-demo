import { useState } from "react";
import Section from "../../components/Section";

export default function FinancialSection({ onNext, onBack }) {
  const [hasLoans, setHasLoans] = useState(""); // Track if user has loans

  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="E. Financial Details" className="fin-section">
      <div className="fin-grid">
        <input
          placeholder="🏦 Bank Name"
          className="fin-input"
        />
        <input
          placeholder="🔢 Account Number"
          className="fin-input"
        />
        <select
          value={hasLoans}
          onChange={(e) => setHasLoans(e.target.value)}
          className="fin-select"
        >
          <option value="">❓ Any Bank Loans?</option>
          <option value="yes">✅ Yes</option>
          <option value="no">❌ No</option>
        </select>
        {hasLoans === "yes" && (
          <>
            <input
              placeholder="💰 Loan Amount"
              className="fin-input"
            />
            <input
              placeholder="📊 Outstanding Balance"
              className="fin-input"
            />
            <input
              placeholder="📅 Monthly Repayment"
              className="fin-input"
            />
          </>
        )}
      </div>

      <div className="fin-buttons">
        <button
          onClick={handleBack}
          className="fin-button fin-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="fin-button fin-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}