import { useState } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function EmploymentDetails({ onNext, onBack }) {
  const [employmentDetails, setEmploymentDetails] = useState({
    name: "",
    employerName: "",
    employmentPosition: "",
    employerAddress: "",
    telephoneNumber: "",
    typeOfContract: "",
    yearsWorked: "",
    netPay: "",
    immediateSupervisorName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentDetails({ ...employmentDetails, [name]: value });
  };

  const handleNext = async () => {
    // Optional: add validation logic here

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save data.");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        { employmentDetails },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onNext();
    } catch (error) {
      console.error("Error saving employment details:", error);
      alert("Failed to save employment details. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="D. Employment Details (Person Paying Loan)" className="emp-section">
      <div className="emp-grid">
        <input
          name="name"
          placeholder="👤 Name"
          value={employmentDetails.name}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="employerName"
          placeholder="🏢 Name of Employer"
          value={employmentDetails.employerName}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="employmentPosition"
          placeholder="💼 Employment Position"
          value={employmentDetails.employmentPosition}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="employerAddress"
          placeholder="🏠 Employer Address"
          value={employmentDetails.employerAddress}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="telephoneNumber"
          placeholder="📞 Telephone Number"
          value={employmentDetails.telephoneNumber}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="typeOfContract"
          placeholder="📝 Type of Contract"
          value={employmentDetails.typeOfContract}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="yearsWorked"
          placeholder="📅 Years Worked"
          value={employmentDetails.yearsWorked}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="netPay"
          placeholder="💰 Net Pay"
          value={employmentDetails.netPay}
          onChange={handleChange}
          className="emp-input"
        />
        <input
          name="immediateSupervisorName"
          placeholder="👔 Immediate Supervisor Name"
          value={employmentDetails.immediateSupervisorName}
          onChange={handleChange}
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
        <button onClick={handleBack} className="emp-button emp-button-back">
          ⬅️ Back
        </button>
        <button onClick={handleNext} className="emp-button emp-button-next">
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}