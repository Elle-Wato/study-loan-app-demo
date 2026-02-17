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

  const [files, setFiles] = useState({
    employmentLetter: null,
    bankStatements: [],
    paySlips: [],
    hrStamp: null,
  });

  const [uploadedUrls, setUploadedUrls] = useState({
    employmentLetter: "",
    bankStatements: [],
    paySlips: [],
    hrStamp: "",
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmploymentDetails({ ...employmentDetails, [name]: value });
  };

  const handleFileChange = (e, fieldName) => {
    const { files: selectedFiles } = e.target;
    
    if (fieldName === "bankStatements" || fieldName === "paySlips") {
      // Multiple files
      setFiles({ ...files, [fieldName]: Array.from(selectedFiles) });
    } else {
      // Single file
      setFiles({ ...files, [fieldName]: selectedFiles[0] });
    }
  };

  const uploadFile = async (file) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_BASE_URL}/uploads/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    });

    return res.data.file_url;
  };

  const handleNext = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save data.");
      return;
    }

    setUploading(true);

    try {
      const urls = { ...uploadedUrls };

      // Upload single files
      if (files.employmentLetter) {
        urls.employmentLetter = await uploadFile(files.employmentLetter);
        console.log("✅ Employment letter uploaded");
      }

      if (files.hrStamp) {
        urls.hrStamp = await uploadFile(files.hrStamp);
        console.log("✅ HR stamp uploaded");
      }

      // Upload multiple bank statements
      if (files.bankStatements.length > 0) {
        urls.bankStatements = await Promise.all(
          files.bankStatements.map(file => uploadFile(file))
        );
        console.log("✅ Bank statements uploaded");
      }

      // Upload multiple pay slips
      if (files.paySlips.length > 0) {
        urls.paySlips = await Promise.all(
          files.paySlips.map(file => uploadFile(file))
        );
        console.log("✅ Pay slips uploaded");
      }

      // Save to database
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        {
          employmentDetails,
          employmentDocuments: urls,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ EMPLOYMENT DETAILS SAVED");
      onNext();
    } catch (error) {
      console.error("❌ Error saving employment details:", error);
      alert("Failed to save employment details. Please try again.");
    } finally {
      setUploading(false);
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
          <input
            type="file"
            className="emp-file"
            onChange={(e) => handleFileChange(e, "employmentLetter")}
            accept=".pdf,.jpg,.png"
          />
          {files.employmentLetter && (
            <p style={{ color: "green", fontSize: "12px" }}>
              ✅ Selected: {files.employmentLetter.name}
            </p>
          )}
        </div>
        <div className="emp-field">
          <label className="emp-label">🏦 Bank Statements (Last 6 Months)</label>
          <input
            type="file"
            multiple
            className="emp-file"
            onChange={(e) => handleFileChange(e, "bankStatements")}
            accept=".pdf,.jpg,.png"
          />
          {files.bankStatements.length > 0 && (
            <p style={{ color: "green", fontSize: "12px" }}>
              ✅ Selected: {files.bankStatements.length} file(s)
            </p>
          )}
        </div>
        <div className="emp-field">
          <label className="emp-label">💵 3 Recent Pay Slips</label>
          <input
            type="file"
            multiple
            className="emp-file"
            onChange={(e) => handleFileChange(e, "paySlips")}
            accept=".pdf,.jpg,.png"
          />
          {files.paySlips.length > 0 && (
            <p style={{ color: "green", fontSize: "12px" }}>
              ✅ Selected: {files.paySlips.length} file(s)
            </p>
          )}
        </div>
        <div className="emp-field">
          <label className="emp-label">✍️ Upload HR Stamp & Supervisor Signature (Scanned)</label>
          <input
            type="file"
            className="emp-file"
            onChange={(e) => handleFileChange(e, "hrStamp")}
            accept=".pdf,.jpg,.png"
          />
          {files.hrStamp && (
            <p style={{ color: "green", fontSize: "12px" }}>
              ✅ Selected: {files.hrStamp.name}
            </p>
          )}
        </div>
      </div>

      <div className="emp-buttons">
        <button
          onClick={handleBack}
          className="emp-button emp-button-back"
          disabled={uploading}
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="emp-button emp-button-next"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "➡️ Next"}
        </button>
      </div>
    </Section>
  );
}