import { useState } from "react";
import axios from "axios";  // Added for API call
import Section from "../../components/Section";
import ProgramSelect from "../../components/ProgramSelect";

const API_BASE_URL = "http://127.0.0.1:5000";  // Your backend URL

export default function StudentRequirements({ onNext }) {
  const [program, setProgram] = useState(""); // Track selected program
  const [personalDetails, setPersonalDetails] = useState({
    fullName: "",
    nationality: "",
    idPassportNo: "",
    dateOfBirth: "",
    maritalStatus: "",
    noOfChildren: "",
    telephoneNo: "",
    kraPin: "",
    county: "",
    postalAddress: "",
    poBox: "",
    socialMedia: "",
    residentialAddress: "",
    permanentHomeAddress: "",
    emailAddress: "",
  });
  const [educationalQualifications, setEducationalQualifications] = useState({
    primary: { level: "", schoolName: "", period: "", grade: "" },
    secondary: { level: "", schoolName: "", period: "", grade: "" },
    postSecondary: { level: "", schoolName: "", period: "", grade: "" },
  });

  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails({ ...personalDetails, [name]: value });
  };

  const handleEducationChange = (section, field, value) => {
    setEducationalQualifications({
      ...educationalQualifications,
      [section]: { ...educationalQualifications[section], [field]: value },
    });
  };

  const handleNext = async () => {  // Made async for API call
    if (!program) {
      alert("Please select a program before proceeding.");
      return;
    }
    // Add more validation if needed (e.g., required fields)

    // Prepare data to send
    const formData = {
      program,
      personalDetails,
      educationalQualifications,
      // Add document uploads if handled (e.g., file URLs after upload)
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to save data.");
        return;
      }

      // Save to backend
      const response = await axios.patch(`${API_BASE_URL}/admin/students/update-details`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log("Data saved successfully:", response.data);
      onNext();  // Proceed to next step
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Please try again.");
    }
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
      </div>

      {/* A. Student Personal Details */}
      <div className="req-section">
        <h3>A. Student Personal Details</h3>
        <div className="req-grid">
          <div className="req-field">
            <label className="req-label">1. Full Name as per ID:</label>
            <input
              type="text"
              name="fullName"
              value={personalDetails.fullName}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">2. Nationality:</label>
            <input
              type="text"
              name="nationality"
              value={personalDetails.nationality}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">3. ID/Passport No.:</label>
            <input
              type="text"
              name="idPassportNo"
              value={personalDetails.idPassportNo}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">4. Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={personalDetails.dateOfBirth}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">5. Marital Status:</label>
            <input
              type="text"
              name="maritalStatus"
              value={personalDetails.maritalStatus}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">6. No. of Children:</label>
            <input
              type="number"
              name="noOfChildren"
              value={personalDetails.noOfChildren}
              onChange={handlePersonalChange}
              className="req-input"
            />
          </div>
          <div className="req-field">
            <label className="req-label">7. Telephone No.:</label>
            <input
              type="tel"
              name="telephoneNo"
              value={personalDetails.telephoneNo}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">8. KRA PIN:</label>
            <input
              type="text"
              name="kraPin"
              value={personalDetails.kraPin}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">9. County:</label>
            <input
              type="text"
              name="county"
              value={personalDetails.county}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">10. Postal Address:</label>
            <input
              type="text"
              name="postalAddress"
              value={personalDetails.postalAddress}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">P. O. Box:</label>
            <input
              type="text"
              name="poBox"
              value={personalDetails.poBox}
              onChange={handlePersonalChange}
              className="req-input"
            />
          </div>
          <div className="req-field">
            <label className="req-label">12. Social media accounts:</label>
            <input
              type="text"
              name="socialMedia"
              value={personalDetails.socialMedia}
              onChange={handlePersonalChange}
              className="req-input"
              placeholder="e.g., Facebook, Twitter handles"
            />
          </div>
          <div className="req-field">
            <label className="req-label">13. Residential Address:</label>
            <input
              type="text"
              name="residentialAddress"
              value={personalDetails.residentialAddress}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">14. Permanent Home Address:</label>
            <input
              type="text"
              name="permanentHomeAddress"
              value={personalDetails.permanentHomeAddress}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
          <div className="req-field">
            <label className="req-label">15. Email Address:</label>
            <input
              type="email"
              name="emailAddress"
              value={personalDetails.emailAddress}
              onChange={handlePersonalChange}
              className="req-input"
              required
            />
          </div>
        </div>
      </div>

      {/* B. Educational Qualification */}
      <div className="req-section">
        <h3>B. Educational Qualification</h3>
        <div className="education-section">
          <h4>a. Primary School</h4>
          <div className="req-grid">
            <input
              placeholder="Level"
              value={educationalQualifications.primary.level}
              onChange={(e) => handleEducationChange("primary", "level", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Name of school"
              value={educationalQualifications.primary.schoolName}
              onChange={(e) => handleEducationChange("primary", "schoolName", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Period"
              value={educationalQualifications.primary.period}
              onChange={(e) => handleEducationChange("primary", "period", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Grade attained"
              value={educationalQualifications.primary.grade}
              onChange={(e) => handleEducationChange("primary", "grade", e.target.value)}
              className="req-input"
            />
          </div>
        </div>
        <div className="education-section">
          <h4>b. Secondary School</h4>
          <div className="req-grid">
            <input
              placeholder="Level"
              value={educationalQualifications.secondary.level}
              onChange={(e) => handleEducationChange("secondary", "level", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Name of school"
              value={educationalQualifications.secondary.schoolName}
              onChange={(e) => handleEducationChange("secondary", "schoolName", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Period"
              value={educationalQualifications.secondary.period}
              onChange={(e) => handleEducationChange("secondary", "period", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Grade attained"
              value={educationalQualifications.secondary.grade}
              onChange={(e) => handleEducationChange("secondary", "grade", e.target.value)}
              className="req-input"
            />
          </div>
        </div>
        <div className="education-section">
          <h4>c. Post-Secondary</h4>
          <div className="req-grid">
            <input
              placeholder="Level"
              value={educationalQualifications.postSecondary.level}
              onChange={(e) => handleEducationChange("postSecondary", "level", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Name of school"
              value={educationalQualifications.postSecondary.schoolName}
              onChange={(e) => handleEducationChange("postSecondary", "schoolName", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Period"
              value={educationalQualifications.postSecondary.period}
              onChange={(e) => handleEducationChange("postSecondary", "period", e.target.value)}
              className="req-input"
            />
            <input
              placeholder="Grade attained"
              value={educationalQualifications.postSecondary.grade}
              onChange={(e) => handleEducationChange("postSecondary", "grade", e.target.value)}
              className="req-input"
            />
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="req-section">
        <h3>Document Uploads</h3>
        <div className="req-grid">
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