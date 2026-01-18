import Section from "../../components/Section";

export default function GuarantorSection({ onNext, onBack, program }) { // Assuming program is passed as prop from parent
  const isPostgraduate = program === "Postgraduate"; // Adjust based on your program values
  const numGuarantors = isPostgraduate ? 1 : 2;

  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="Guarantor Details & Application" className="guar-section">
      <p className="guar-text">
        📝 Download, print, fill, sign, then upload the documents below. 
        <br />
        <strong>Note:</strong> For Postgraduate programs, only 1 guarantor is required. For other programs, 2 guarantors are needed.
      </p>

      {Array.from({ length: numGuarantors }, (_, index) => (
        <div key={index} className="guar-guarantor">
          <h4>Guarantor {index + 1}</h4>
          <div className="guar-grid">
            <div className="guar-item">
              <a href="/guarantor-agreement.pdf" download className="guar-link">
                ⬇️ Download Guarantor Application Form
              </a>
              <input type="file" className="guar-file" />
            </div>
            <div className="guar-item">
              <label className="guar-label">🆔 Copy of ID</label>
              <input type="file" className="guar-file" />
            </div>
            <div className="guar-item">
              <label className="guar-label">📸 Passport Size Photo</label>
              <input type="file" className="guar-file" />
            </div>
          </div>
        </div>
      ))}

      <div className="guar-buttons">
        <button
          onClick={handleBack}
          className="guar-button guar-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="guar-button guar-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}