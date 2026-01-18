import { useNavigate } from "react-router-dom";
import Section from "../../components/Section";

export default function GuarantorSection({ onBack }) {
  const navigate = useNavigate();

  const handleComplete = () => {
    // TODO: submit collected form data to backend here

    // Navigate to success page
    navigate("/success");
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <Section title="Guarantor Details & Agreement" className="guar-section">
      <div className="guar-group">
        <h4 className="guar-heading">👤 Applicant / Guarantor Details</h4>
        <div className="guar-grid">
          <input
            placeholder="👤 Full Name"
            className="guar-input"
          />
          <input
            placeholder="🆔 ID Number"
            className="guar-input"
          />
          <input
            placeholder="📞 Phone Number"
            className="guar-input"
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="guar-input"
          />
          <input
            placeholder="💍 Marital Status"
            className="guar-input"
          />
          <input
            placeholder="👶 Number of Children"
            className="guar-input"
          />
          <input
            placeholder="🏠 Physical Address"
            className="guar-input"
          />
          <input
            placeholder="🏢 Place of Work"
            className="guar-input"
          />
          <input
            placeholder="💼 Position Held"
            className="guar-input"
          />
          <input
            placeholder="💵 Net Salary"
            className="guar-input"
          />
        </div>
      </div>

      <div className="guar-group">
        <h4 className="guar-heading">🔒 Loan Guarantee Details</h4>
        <div className="guar-grid">
          <input
            placeholder="👤 Applicant Name"
            className="guar-input"
          />
          <input
            placeholder="💰 Loan Amount Guaranteed"
            className="guar-input"
          />
          <input
            placeholder="👪 Relationship to Applicant"
            className="guar-input"
          />
        </div>
      </div>

      <div className="guar-group">
        <h4 className="guar-heading">📎 Attachments</h4>
        <div className="guar-grid">
          <div className="guar-field">
            <label className="guar-label">🆔 Copy of ID</label>
            <input type="file" className="guar-file" />
          </div>
          <div className="guar-field">
            <label className="guar-label">📸 Passport Size Photo</label>
            <input type="file" className="guar-file" />
          </div>
          <div className="guar-field">
            <label className="guar-label">✍️ Signed Guarantor Agreement</label>
            <input type="file" className="guar-file" />
          </div>
        </div>
      </div>

      <div className="guar-buttons">
        <button
          onClick={handleBack}
          className="guar-button guar-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleComplete}
          className="guar-button guar-button-complete"
        >
          ✅ Complete
        </button>
      </div>
    </Section>
  );
}