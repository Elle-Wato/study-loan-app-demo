import Section from "../../components/Section";

export default function RefereesSection({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="G. Referees" className="ref-section">
      <div className="ref-group">
        <h4 className="ref-heading">👫 1st Referee (Spouse)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
          />
        </div>
      </div>

      <div className="ref-group">
        <h4 className="ref-heading">👔 2nd Referee (Colleague / Business)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
          />
        </div>
      </div>

      <div className="ref-group">
        <h4 className="ref-heading">👥 3rd Referee (Other)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
          />
        </div>
      </div>

      <div className="ref-buttons">
        <button
          onClick={handleBack}
          className="ref-button ref-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="ref-button ref-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}