import { useState, useEffect } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function RefereesSection({ onNext, onBack, formData, updateFormData }) {
  const [referees, setReferees] = useState(formData.referees || {
    firstReferee: {
      name: "",
      contacts: "",
      email: "",
      placeOfWork: ""
    },
    secondReferee: {
      name: "",
      contacts: "",
      email: "",
      placeOfWork: ""
    },
    thirdReferee: {
      name: "",
      contacts: "",
      email: "",
      placeOfWork: ""
    }
  });

  useEffect(() => {
    updateFormData("referees", referees);
  }, [referees]);

  const handleChange = (referee, field, value) => {
    setReferees({
      ...referees,
      [referee]: {
        ...referees[referee],
        [field]: value
      }
    });
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
        { referees },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("✅ REFEREES SAVED SUCCESSFULLY");
      onNext();
    } catch (error) {
      console.error("❌ ERROR SAVING REFEREES:", error.response?.data || error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="G. Referees" className="ref-section">
      <div className="ref-group">
        <h4 className="ref-heading">👫 1st Referee (Spouse)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
            value={referees.firstReferee.name}
            onChange={(e) => handleChange("firstReferee", "name", e.target.value)}
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
            value={referees.firstReferee.contacts}
            onChange={(e) => handleChange("firstReferee", "contacts", e.target.value)}
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
            value={referees.firstReferee.email}
            onChange={(e) => handleChange("firstReferee", "email", e.target.value)}
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
            value={referees.firstReferee.placeOfWork}
            onChange={(e) => handleChange("firstReferee", "placeOfWork", e.target.value)}
          />
        </div>
      </div>

      <div className="ref-group">
        <h4 className="ref-heading">👔 2nd Referee (Colleague / Business)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
            value={referees.secondReferee.name}
            onChange={(e) => handleChange("secondReferee", "name", e.target.value)}
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
            value={referees.secondReferee.contacts}
            onChange={(e) => handleChange("secondReferee", "contacts", e.target.value)}
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
            value={referees.secondReferee.email}
            onChange={(e) => handleChange("secondReferee", "email", e.target.value)}
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
            value={referees.secondReferee.placeOfWork}
            onChange={(e) => handleChange("secondReferee", "placeOfWork", e.target.value)}
          />
        </div>
      </div>

      <div className="ref-group">
        <h4 className="ref-heading">👥 3rd Referee (Other)</h4>
        <div className="ref-grid">
          <input
            placeholder="👤 Name"
            className="ref-input"
            value={referees.thirdReferee.name}
            onChange={(e) => handleChange("thirdReferee", "name", e.target.value)}
          />
          <input
            placeholder="📞 Contacts"
            className="ref-input"
            value={referees.thirdReferee.contacts}
            onChange={(e) => handleChange("thirdReferee", "contacts", e.target.value)}
          />
          <input
            type="email"
            placeholder="📧 Email Address"
            className="ref-input"
            value={referees.thirdReferee.email}
            onChange={(e) => handleChange("thirdReferee", "email", e.target.value)}
          />
          <input
            placeholder="🏢 Place of Work"
            className="ref-input"
            value={referees.thirdReferee.placeOfWork}
            onChange={(e) => handleChange("thirdReferee", "placeOfWork", e.target.value)}
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