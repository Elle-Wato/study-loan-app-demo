import Section from "../../components/Section";

export default function EmploymentDetails({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="D. Employment Details (Person Paying Loan)" className="emp-section">
      <div className="emp-grid">
        <input
          placeholder="👤 Name"
          className="emp-input"
        />
        <input
          placeholder="🏢 Name of Employer"
          className="emp-input"
        />
        <input
          placeholder="💼 Employment Position"
          className="emp-input"
        />
        <input
          placeholder="🏠 Employer Address"
          className="emp-input"
        />
        <input
          placeholder="📞 Telephone Number"
          className="emp-input"
        />
        <input
          placeholder="📝 Type of Contract"
          className="emp-input"
        />
        <input
          placeholder="📅 Years Worked"
          className="emp-input"
        />
        <input
          placeholder="💰 Net Pay"
          className="emp-input"
        />
        <input
          placeholder="👔 Immediate Supervisor Name"
          className="emp-input"
        />
      </div>

      <h4 className="emp-subtitle">📎 Attachments</h4>
      <div className="emp-grid">
        <div className="emp-field">
          <label className="emp-label">📜 Employment Letter / Business Registration</label>
          <input type="file" className="emp-file" />
        </div>
        <div className="emp-field">
          <label className="emp-label">🏦 Bank Statements (Last 6 Months)</label>
          <input type="file" multiple className="emp-file" />
        </div>
        <div className="emp-field">
          <label className="emp-label">💵 3 Recent Pay Slips</label>
          <input type="file" multiple className="emp-file" />
        </div>
        <div className="emp-field">
          <label className="emp-label">✍️ Upload HR Stamp & Supervisor Signature (Scanned)</label>
          <input type="file" className="emp-file" />
        </div>
      </div>

    

      <div className="emp-buttons">
        <button
          onClick={handleBack}
          className="emp-button emp-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="emp-button emp-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}