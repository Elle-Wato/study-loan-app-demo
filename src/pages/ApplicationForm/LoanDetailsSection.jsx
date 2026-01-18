import Section from "../../components/Section";

export default function LoanDetailsSection({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="F. AEDT Loan Details" className="loan-section">
      <div className="loan-grid">
        <input
          placeholder="🎓 University / College Name"
          className="loan-input"
        />
        <input
          placeholder="📚 Study Program"
          className="loan-input"
        />
        <input
          placeholder="📖 Level of Study (Sem 1, Sem 2)"
          className="loan-input"
        />
        <input
          placeholder="💵 Amount Applied (Ksh)"
          className="loan-input"
        />
        <input
          placeholder="⏰ Repayment Period"
          className="loan-input"
        />
        <input
          placeholder="🔒 Loan Security (Guarantor / Collateral)"
          className="loan-input"
        />
      </div>

      <div className="loan-buttons">
        <button
          onClick={handleBack}
          className="loan-button loan-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="loan-button loan-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}