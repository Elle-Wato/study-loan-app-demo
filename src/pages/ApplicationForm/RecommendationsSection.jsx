import Section from "../../components/Section";

export default function RecommendationsSection({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="J & K. Community Recommendations" className="rec-section">
      <p className="rec-text">
        📝 Download, print, stamp, sign, then upload the documents below.
      </p>

      <div className="rec-grid">
        <div className="rec-item">
          <a href="/chief-recommendation.pdf" download className="rec-link">
            ⬇️ Download Chief Recommendation Form
          </a>
          <input type="file" className="rec-file" />
        </div>
        <div className="rec-item">
          <a href="/imam-recommendation.pdf" download className="rec-link">
            ⬇️ Download Imam Recommendation Form
          </a>
          <input type="file" className="rec-file" />
        </div>
      </div>

      <div className="rec-buttons">
        <button
          onClick={handleBack}
          className="rec-button rec-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="rec-button rec-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}

