import { useState } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function LoanDetailsSection({ onNext, onBack }) {
  const [loanDetails, setLoanDetails] = useState({
    universityName: "",
    studyProgram: "",
    levelOfStudy: "",
    amountApplied: "",
    repaymentPeriod: "",
    loanSecurity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanDetails({ ...loanDetails, [name]: value });
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
        { loanDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onNext();
    } catch (error) {
      console.error("Failed to save loan details:", error);
      alert("Failed to save loan details. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="F. AEDT Loan Details" className="loan-section">
      <div className="loan-grid">
        <input
          name="universityName"
          placeholder="🎓 University / College Name"
          value={loanDetails.universityName}
          onChange={handleChange}
          className="loan-input"
        />
        <input
          name="studyProgram"
          placeholder="📚 Study Program"
          value={loanDetails.studyProgram}
          onChange={handleChange}
          className="loan-input"
        />
        <input
          name="levelOfStudy"
          placeholder="📖 Level of Study (Sem 1, Sem 2)"
          value={loanDetails.levelOfStudy}
          onChange={handleChange}
          className="loan-input"
        />
        <input
          name="amountApplied"
          placeholder="💵 Amount Applied (Ksh)"
          value={loanDetails.amountApplied}
          onChange={handleChange}
          className="loan-input"
        />
        <input
          name="repaymentPeriod"
          placeholder="⏰ Repayment Period"
          value={loanDetails.repaymentPeriod}
          onChange={handleChange}
          className="loan-input"
        />
        <input
          name="loanSecurity"
          placeholder="🔒 Loan Security (Guarantor / Collateral)"
          value={loanDetails.loanSecurity}
          onChange={handleChange}
          className="loan-input"
        />
      </div>

      <div className="loan-buttons">
        <button onClick={handleBack} className="loan-button loan-button-back">
          ⬅️ Back
        </button>
        <button onClick={handleNext} className="loan-button loan-button-next">
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}