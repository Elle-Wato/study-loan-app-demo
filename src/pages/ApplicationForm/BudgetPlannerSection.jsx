import { useState } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function BudgetPlannerSection({ onNext, onBack }) {
  const [budgetDetails, setBudgetDetails] = useState({
    netSalary: "",
    businessIncome: "",
    otherIncome: "",
    householdExpenses: "",
    rentalExpenses: "",
    transportExpenses: "",
    otherExpenses: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBudgetDetails({ ...budgetDetails, [name]: value });
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
        { budgetDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("✅ BUDGET DETAILS SAVED");
      onNext();
    } catch (error) {
      console.error("❌ ERROR SAVING BUDGET:", error.response?.data || error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="H. Budget Planner" className="budget-section">
      <div className="budget-group">
        <h4 className="budget-heading">💰 Income</h4>
        <div className="budget-grid">
          <input
            name="netSalary"
            placeholder="💵 Net Salary"
            className="budget-input"
            value={budgetDetails.netSalary}
            onChange={handleChange}
          />
          <input
            name="businessIncome"
            placeholder="🏢 Business Income"
            className="budget-input"
            value={budgetDetails.businessIncome}
            onChange={handleChange}
          />
          <input
            name="otherIncome"
            placeholder="➕ Other Income"
            className="budget-input"
            value={budgetDetails.otherIncome}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="budget-group">
        <h4 className="budget-heading">📊 Expenses</h4>
        <div className="budget-grid">
          <input
            name="householdExpenses"
            placeholder="🏠 Household Expenses"
            className="budget-input"
            value={budgetDetails.householdExpenses}
            onChange={handleChange}
          />
          <input
            name="rentalExpenses"
            placeholder="🏘️ Rental Expenses"
            className="budget-input"
            value={budgetDetails.rentalExpenses}
            onChange={handleChange}
          />
          <input
            name="transportExpenses"
            placeholder="🚗 Transport Expenses"
            className="budget-input"
            value={budgetDetails.transportExpenses}
            onChange={handleChange}
          />
          <input
            name="otherExpenses"
            placeholder="➕ Other Expenses"
            className="budget-input"
            value={budgetDetails.otherExpenses}
            onChange={handleChange}
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