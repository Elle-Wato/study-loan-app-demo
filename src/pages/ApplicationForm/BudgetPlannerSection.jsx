import Section from "../../components/Section";

export default function BudgetPlannerSection({ onNext, onBack }) {
  const handleNext = () => {
    // You can add validation here if needed (e.g., check required fields)
    onNext(); // Move to next section
  };

  const handleBack = () => {
    onBack(); // Go back to previous section
  };

  return (
    <Section title="H. Budget Planner" className="budget-section">
      <div className="budget-group">
        <h4 className="budget-heading">💰 Income</h4>
        <div className="budget-grid">
          <input
            placeholder="💵 Net Salary"
            className="budget-input"
          />
          <input
            placeholder="🏢 Business Income"
            className="budget-input"
          />
          <input
            placeholder="➕ Other Income"
            className="budget-input"
          />
        </div>
      </div>

      <div className="budget-group">
        <h4 className="budget-heading">📊 Expenses</h4>
        <div className="budget-grid">
          <input
            placeholder="🏠 Household Expenses"
            className="budget-input"
          />
          <input
            placeholder="🏘️ Rental Expenses"
            className="budget-input"
          />
          <input
            placeholder="🚗 Transport Expenses"
            className="budget-input"
          />
          <input
            placeholder="➕ Other Expenses"
            className="budget-input"
          />
        </div>
      </div>

      <div className="budget-buttons">
        <button
          onClick={handleBack}
          className="budget-button budget-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="budget-button budget-button-next"
        >
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}