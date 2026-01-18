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
        📝 Upload the stamped and signed Chief and Imam recommendation.
      </p>

      <div className="rec-grid">
        <div className="rec-item">
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