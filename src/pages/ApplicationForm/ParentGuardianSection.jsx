import { useState, useEffect } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function ParentGuardianSection({ onNext, onBack, formData, updateFormData }) {
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

  const [documents, setDocuments] = useState({
    idCopy: null,
    kraPinCopy: null,
    passportPhoto: null,
  });

  const [uploadedUrls, setUploadedUrls] = useState(formData.parentGuardianDocuments ||{
    idCopy: "",
    kraPinCopy: "",
    passportPhoto: "",
  });

  const [uploading, setUploading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setParentGuardian({ ...parentGuardian, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setDocuments({ ...documents, [name]: files[0] });
      uploadFile(name, files[0]);
    }
  };

  const uploadFile = async (fieldName, file) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to upload files.");
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await axios.post(
        `${API_BASE_URL}/uploads/upload`,
        formDataUpload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const fileUrl = res.data.file_url;
      setUploadedUrls((prev) => {
  const updated = { ...prev, [fieldName]: fileUrl };
  updateFormData("parentGuardianDocuments", updated);
  return updated;
});

      console.log(`✅ ${fieldName} uploaded:`, fileUrl);
    } catch (error) {
      console.error(`❌ Error uploading ${fieldName}:`, error);
      alert(`Failed to upload ${fieldName}`);
    } finally {
      setUploading(false);
    }
  };

  const handleNext = async () => {
    if (!parentGuardian.parentName || !parentGuardian.telephone) {
      alert("Please fill in the required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save data.");
      return;
    }

    try {
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        {
          parentGuardian,
          parentGuardianDocuments: uploadedUrls, // Save document URLs
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ PARENT/GUARDIAN DATA SAVED");
      onNext();
    } catch (error) {
      console.error("❌ ERROR:", error);
      alert("Failed to save data. Please try again.");
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="B. Parent / Guardian Details" className="parent-section">
      <div className="parent-grid">
        <input
          name="parentName"
          placeholder="👨‍👩‍👧 Full Name of Parent / Guardian"
          value={parentGuardian.parentName}
          onChange={handleChange}
          required
          className="parent-input"
        />
        <input
          name="relationship"
          placeholder="👪 Relationship"
          value={parentGuardian.relationship}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="idNumber"
          placeholder="🆔 ID Number"
          value={parentGuardian.idNumber}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="kraPin"
          placeholder="📋 KRA PIN"
          value={parentGuardian.kraPin}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="telephone"
          placeholder="📞 Telephone Number"
          value={parentGuardian.telephone}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="numberOfChildren"
          placeholder="👶 Number of Children"
          value={parentGuardian.numberOfChildren}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="residentialAddress"
          placeholder="🏠 Residential Address"
          value={parentGuardian.residentialAddress}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          type="email"
          name="emailAddress"
          placeholder="📧 Email Address"
          value={parentGuardian.emailAddress}
          onChange={handleChange}
          className="parent-input"
        />
        <input
          name="placeOfWork"
          placeholder="🏢 Place of Work"
          value={parentGuardian.placeOfWork}
          onChange={handleChange}
          className="parent-input"
        />
      </div>

      <h4 className="parent-subtitle">📎 Required Attachments</h4>
      <div className="parent-grid">
        <div className="parent-field">
          <label className="parent-label" htmlFor="idCopy">
            🆔 Copy of ID
          </label>
          <input
            type="file"
            id="idCopy"
            name="idCopy"
            className="parent-file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
          />
          {uploadedUrls.idCopy && (
  <div style={{ fontSize: "12px", marginTop: "4px" }}>
    ✅ Uploaded |{" "}
    <a
      href={uploadedUrls.idCopy}
      target="_blank"
      rel="noopener noreferrer"
    >
      View File
    </a>
  </div>
)}
</div>


        <div className="parent-field">
          <label className="parent-label" htmlFor="kraPinCopy">
            📋 Copy of KRA PIN
          </label>
          <input
            type="file"
            id="kraPinCopy"
            name="kraPinCopy"
            className="parent-file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.png"
          />
          {uploadedUrls.kraPinCopy && (
  <div style={{ fontSize: "12px", marginTop: "4px" }}>
    ✅ Uploaded |{" "}
    <a
      href={uploadedUrls.kraPinCopy}
      target="_blank"
      rel="noopener noreferrer"
    >
      View File
    </a>
  </div>
          )}
        </div>

        <div className="parent-field">
          <label className="parent-label" htmlFor="passportPhoto">
            📸 Passport Size Photo
          </label>
          <input
            type="file"
            id="passportPhoto"
            name="passportPhoto"
            className="parent-file"
            onChange={handleFileChange}
            accept=".jpg,.png"
          />
          {uploadedUrls.passportPhoto && (
  <div style={{ fontSize: "12px", marginTop: "4px" }}>
    ✅ Uploaded |{" "}
    <a
      href={uploadedUrls.passportPhoto}
      target="_blank"
      rel="noopener noreferrer"
    >
      View File
    </a>
  </div>
          )}
        </div>
      </div>

      <div className="parent-buttons">
        <button
          onClick={handleBack}
          className="parent-button parent-button-back"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="parent-button parent-button-next"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "➡️ Next"}
        </button>
      </div>
    </Section>
  );
}