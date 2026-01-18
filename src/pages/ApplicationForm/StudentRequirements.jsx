import { useState } from "react";
import Section from "../../components/Section";
import ProgramSelect from "../../components/ProgramSelect";

export default function StudentRequirements({ onNext }) {
  const [program, setProgram] = useState(""); // Track selected program

  const handleNext = () => {
    if (!program) {
      alert("Please select a program before proceeding.");
      return;
    }
    onNext(); // Move to next section
  };

  return (
    <Section title="Student Requirements" className="req-section">
      <div className="req-grid">
        <div className="req-field">
          <label className="req-label">🎓 Choose Program</label>
          <ProgramSelect
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            className="req-select"
          />
        </div>

        <div className="req-field">
          <label className="req-label">📄 Curriculum Vitae (CV)</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">📜 Form 4 Certificate</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">🏫 School Leaving Certificate</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">🎓 University Admission Letter</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">🆔 National ID</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">📋 KRA PIN</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">📸 Passport Size Photo</label>
          <input type="file" className="req-file" />
        </div>

        <div className="req-field">
          <label className="req-label">✍️ 300-word Loan Justification Essay</label>
          <input type="file" className="req-file" />
        </div>
      </div>

      <button
        onClick={handleNext}
        className="req-button"
      >
        ➡️ Next
      </button>
    </Section>
  );
}