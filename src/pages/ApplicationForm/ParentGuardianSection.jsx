import Section from "../../components/Section";

export default function ParentGuardianSection({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="B. Parent / Guardian Details" className="parent-section">
      <div className="parent-grid">
        <input
          placeholder="👨‍👩‍👧 Full Name of Parent / Guardian"
          required
          className="parent-input"
        />
        <input
          placeholder="👪 Relationship"
          className="parent-input"
        />
        <input
          placeholder="🆔 ID Number"
          className="parent-input"
        />
        <input
          placeholder="📋 KRA PIN"
          className="parent-input"
        />
        <input
          placeholder="📞 Telephone Number"
          className="parent-input"
        />
        <input
          placeholder="👶 Number of Children"
          className="parent-input"
        />
        <input
          placeholder="🏠 Residential Address"
          className="parent-input"
        />
        <input
          type="email"
          placeholder="📧 Email Address"
          className="parent-input"
        />
        <input
          placeholder="🏢 Place of Work"
          className="parent-input"
        />
      </div>

      <h4 className="parent-subtitle">📎 Required Attachments</h4>
      <div className="parent-grid">
        <div className="parent-field">
          <label className="parent-label">🆔 Copy of ID</label>
          <input type="file" className="parent-file" />
        </div>
        <div className="parent-field">
          <label className="parent-label">📋 Copy of KRA PIN</label>
          <input type="file" className="parent-file" />
        </div>
        <div className="parent-field">
          <label className="parent-label">📸 Passport Size Photo</label>
          <input type="file" className="parent-file" />
        </div>
      </div>

      <div className="parent-buttons">
        <button
          onClick={handleBack}
          className="parent-button parent-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="parent-button parent-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}