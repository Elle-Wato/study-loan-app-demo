import { useState, useEffect } from "react";
import { studentAPI } from "../../api/api";
import Section from "../../components/Section";

export default function ParentGuardianSection({ onNext, onBack, formData, updateFormData, isLocked }) {
  const [parentGuardian, setParentGuardian] = useState(formData.parentGuardian || {
    parentName: "",
    relationship: "",
    idNumber: "",
    kraPin: "",
    telephone: "",
    numberOfChildren: "",
    residentialAddress: "",
    emailAddress: "",
    placeOfWork: "",
  });

  const [uploadedUrls, setUploadedUrls] = useState(formData.parentGuardianDocuments || {
    idCopy: "",
    kraPinCopy: "",
    passportPhoto: "",
  });

  const [uploading, setUploading] = useState({});

  // ── Sync to parent ──
  useEffect(() => {
    updateFormData("parentGuardian", parentGuardian);
  }, [parentGuardian]);

  useEffect(() => {
    updateFormData("parentGuardianDocuments", uploadedUrls);
  }, [uploadedUrls]);

  const handleChange = (e) => {
    if (isLocked) return;
    const { name, value } = e.target;
    setParentGuardian({ ...parentGuardian, [name]: value });
  };

  const handleFileChange = async (e) => {
    if (isLocked) return;
    const { name, files } = e.target;
    if (!files || !files[0]) return;

    setUploading((prev) => ({ ...prev, [name]: true }));
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", files[0]);
      const res = await studentAPI.uploadFile(formDataUpload);
      setUploadedUrls((prev) => ({ ...prev, [name]: res.data.file_url }));
    } catch (error) {
      console.error(`❌ Error uploading ${name}:`, error);
      alert(`Failed to upload ${name}`);
    } finally {
      setUploading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleNext = async () => {
    if (!parentGuardian.parentName || !parentGuardian.telephone) {
      alert("Please fill in the required fields.");
      return;
    }
    try {
      await studentAPI.updateDetails({
        parentGuardian,
        parentGuardianDocuments: uploadedUrls,
      });
      onNext();
    } catch (error) {
      console.error("❌ ERROR:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  // ── Styles ──
  const inputStyle = {
    background: isLocked ? "#f5f5f5" : "",
    cursor: isLocked ? "not-allowed" : "text",
    color: isLocked ? "#888" : "#333",
  };

  const fileInputStyle = {
    cursor: isLocked ? "not-allowed" : "pointer",
    opacity: isLocked ? 0.6 : 1,
  };

  const isUploading = Object.values(uploading).some(Boolean);

  return (
    <Section title="B. Parent / Guardian Details" className="parent-section">

      {/* ── LOCKED BANNER ── */}
      {isLocked && (
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          padding: "14px 20px",
          marginBottom: "20px",
          color: "#b45309",
          fontWeight: "600",
          fontSize: "14px",
        }}>
          🔒 This section is locked and cannot be edited.
        </div>
      )}

      {/* ── FORM FIELDS ── */}
      <div className="parent-grid">
        {[
          { name: "parentName", placeholder: "👨‍👩‍👧 Full Name of Parent / Guardian", type: "text", required: true },
          { name: "relationship", placeholder: "👪 Relationship", type: "text" },
          { name: "idNumber", placeholder: "🆔 ID Number", type: "text" },
          { name: "kraPin", placeholder: "📋 KRA PIN", type: "text" },
          { name: "telephone", placeholder: "📞 Telephone Number", type: "tel", required: true },
          { name: "numberOfChildren", placeholder: "👶 Number of Children", type: "number" },
          { name: "residentialAddress", placeholder: "🏠 Residential Address", type: "text" },
          { name: "emailAddress", placeholder: "📧 Email Address", type: "email" },
          { name: "placeOfWork", placeholder: "🏢 Place of Work", type: "text" },
        ].map(({ name, placeholder, type }) => (
          <input
            key={name}
            type={type}
            name={name}
            placeholder={placeholder}
            value={parentGuardian[name] || ""}
            onChange={handleChange}
            disabled={isLocked}
            className="parent-input"
            style={inputStyle}
          />
        ))}
      </div>

      {/* ── DOCUMENT UPLOADS ── */}
      <h4 className="parent-subtitle">📎 Required Attachments</h4>
      <div className="parent-grid">
        {[
          { name: "idCopy", label: "🆔 Copy of ID", accept: ".pdf,.jpg,.png" },
          { name: "kraPinCopy", label: "📋 Copy of KRA PIN", accept: ".pdf,.jpg,.png" },
          { name: "passportPhoto", label: "📸 Passport Size Photo", accept: ".jpg,.png" },
        ].map(({ name, label, accept }) => (
          <div className="parent-field" key={name}>
            <label className="parent-label">{label}</label>
            <input
              type="file"
              name={name}
              className="parent-file"
              onChange={handleFileChange}
              accept={accept}
              disabled={isLocked}
              style={fileInputStyle}
            />
            {/* Uploading spinner */}
            {uploading[name] && (
              <div style={{ fontSize: "12px", color: "#2d6a9f", marginTop: "4px" }}>
                ⏳ Uploading...
              </div>
            )}
            {/* Uploaded link */}
            {uploadedUrls[name] && !uploading[name] && (
              <div style={{ fontSize: "12px", marginTop: "4px", color: "#27ae60" }}>
                ✅ Uploaded |{" "}
                <a href={uploadedUrls[name]} target="_blank" rel="noopener noreferrer"
                  style={{ color: "#2d6a9f", fontWeight: "600" }}>
                  View File
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── BUTTONS ── */}
      <div className="parent-buttons">
        <button onClick={onBack} className="parent-button parent-button-back">
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="parent-button parent-button-next"
          disabled={isUploading}
        >
          {isUploading ? "⏳ Uploading..." : "➡️ Next"}
        </button>
      </div>
    </Section>
  );
}