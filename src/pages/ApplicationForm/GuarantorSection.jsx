import { useState } from "react";
import axios from "axios";
import Section from "../../components/Section";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function GuarantorSection({ onNext, onBack, program }) {
  const isPostgraduate = program === "postgraduate" || program === "Postgraduate";
  const numGuarantors = isPostgraduate ? 1 : 2;

  const [guarantors, setGuarantors] = useState(
    Array.from({ length: numGuarantors }, () => ({
      fullName: "",
      idNumber: "",
      phoneNumber: "",
      emailAddress: "",
      maritalStatus: "",
      noOfChildren: "",
      permanentAddress: "",
      physicalAddress: "",
      placeOfWork: "",
      positionHeld: "",
      netSalary: "",
      applicantName: "",
      applicantId: "",
      loanAmount: "",
      relationship: "",
      otherGuarantee: "",
      otherGuaranteeAmount: "",
      maturityDate: "",
      currentLoan: "",
      referee1Name: "",
      referee1Phone: "",
      referee1Email: "",
      referee2Name: "",
      referee2Phone: "",
      referee2Email: "",
      consentFile: null,
      idFile: null,
      photoFile: null,
      consentFileUrl: "",
      idFileUrl: "",
      photoFileUrl: "",
    }))
  );

  const [uploading, setUploading] = useState(false);

  const handleChange = (index, field, value) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = value;
    setGuarantors(updatedGuarantors);
  };

  const handleFileChange = (index, field, file) => {
    const updatedGuarantors = [...guarantors];
    updatedGuarantors[index][field] = file;
    setGuarantors(updatedGuarantors);
  };

  const uploadFile = async (file, token) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      `${API_BASE_URL}/uploads/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
      }
    );

    return res.data.file_url;
  };

  const handleNext = async () => {
    // Validation
    for (let i = 0; i < guarantors.length; i++) {
      const g = guarantors[i];
      if (!g.fullName || !g.idNumber || !g.phoneNumber || !g.emailAddress) {
        alert(`Please fill all required fields for Guarantor ${i + 1}`);
        return;
      }
      if (!g.consentFile || !g.idFile || !g.photoFile) {
        alert(`Please select all required documents for Guarantor ${i + 1}`);
        return;
      }
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to save data.");
      return;
    }

    setUploading(true);

    try {
      const updatedGuarantors = [...guarantors];

      // Upload all files for all guarantors
      for (let i = 0; i < updatedGuarantors.length; i++) {
        const g = updatedGuarantors[i];

        console.log(`Uploading files for Guarantor ${i + 1}...`);

        // Upload consent file
        if (g.consentFile) {
          g.consentFileUrl = await uploadFile(g.consentFile, token);
          console.log(`✅ Consent file uploaded for Guarantor ${i + 1}`);
        }

        // Upload ID file
        if (g.idFile) {
          g.idFileUrl = await uploadFile(g.idFile, token);
          console.log(`✅ ID file uploaded for Guarantor ${i + 1}`);
        }

        // Upload photo file
        if (g.photoFile) {
          g.photoFileUrl = await uploadFile(g.photoFile, token);
          console.log(`✅ Photo file uploaded for Guarantor ${i + 1}`);
        }

        // Remove file objects (only keep URLs)
        delete g.consentFile;
        delete g.idFile;
        delete g.photoFile;
      }

      // Save to database
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        { guarantors: updatedGuarantors },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ GUARANTORS SAVED");
      onNext();
    } catch (error) {
      console.error("❌ ERROR:", error);
      
      if (error.response?.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        alert("Failed to save data. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    onBack();
  };

  return (
    <Section title="Guarantor Details & Application" className="guar-section">
      <div className="guar-instructions">
        <h3>GUARANTOR FORM/AGREEMENT</h3>
        <p><strong>IMPORTANT: PLEASE READ THESE DIRECTIONS BEFORE COMPLETING THE FORM:</strong></p>
        <ol>
          <li>The Guarantor must disclose all current debts and obligations enclosed to this application.</li>
          <li>The Guarantor must provide all information requested. The AEDT is relying on the information provided. Incomplete answers or misinterpretation of information can jeopardize the ability of the individual to become the Guarantor.</li>
          <li>All Guarantors must complete the application to the best of their knowledge.</li>
          <li>The Guarantor shall not be a relative or individual who is dependent on the primary borrower for their livelihood.</li>
          <li>All Guarantors will be obliged to make payments on the loan should the primary borrower fail to make the payments. Any contract between the primary borrower and the Guarantor is strictly between them, and the AEDT will have no part in the contract.</li>
          <li>The Guarantor should be 30 years of age and above.</li>
        </ol>
      </div>

      <p className="guar-text">
        📝 Fill out the form below and upload the required documents.
        <br />
        <strong>Note:</strong> For Postgraduate programs, only 1 guarantor is required. For other programs, 2 guarantors are needed.
      </p>

      {guarantors.map((guarantor, index) => (
        <div key={index} className="guar-guarantor">
          <h4>Guarantor {index + 1}</h4>

          {/* 1.0 GUARANTOR DETAILS */}
          <div className="guar-section">
            <h5>1.0 GUARANTOR DETAILS</h5>
            <div className="guar-grid">
              <div className="guar-field">
                <label className="guar-label">Full Name:</label>
                <input
                  type="text"
                  value={guarantor.fullName}
                  onChange={(e) => handleChange(index, "fullName", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">ID Number:</label>
                <input
                  type="text"
                  value={guarantor.idNumber}
                  onChange={(e) => handleChange(index, "idNumber", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Phone Number:</label>
                <input
                  type="tel"
                  value={guarantor.phoneNumber}
                  onChange={(e) => handleChange(index, "phoneNumber", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Email Address:</label>
                <input
                  type="email"
                  value={guarantor.emailAddress}
                  onChange={(e) => handleChange(index, "emailAddress", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Marital Status:</label>
                <input
                  type="text"
                  value={guarantor.maritalStatus}
                  onChange={(e) => handleChange(index, "maritalStatus", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">No. of children:</label>
                <input
                  type="number"
                  value={guarantor.noOfChildren}
                  onChange={(e) => handleChange(index, "noOfChildren", e.target.value)}
                  className="guar-input"
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Permanent Address:</label>
                <input
                  type="text"
                  value={guarantor.permanentAddress}
                  onChange={(e) => handleChange(index, "permanentAddress", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Physical Address:</label>
                <input
                  type="text"
                  value={guarantor.physicalAddress}
                  onChange={(e) => handleChange(index, "physicalAddress", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Place of Work:</label>
                <input
                  type="text"
                  value={guarantor.placeOfWork}
                  onChange={(e) => handleChange(index, "placeOfWork", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Position held:</label>
                <input
                  type="text"
                  value={guarantor.positionHeld}
                  onChange={(e) => handleChange(index, "positionHeld", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Net Salary:</label>
                <input
                  type="number"
                  value={guarantor.netSalary}
                  onChange={(e) => handleChange(index, "netSalary", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* 2.0 LOAN DETAILS */}
          <div className="guar-section">
            <h5>2.0 LOAN DETAILS</h5>
            <div className="guar-grid">
              <div className="guar-field">
                <label className="guar-label">Applicant's Name:</label>
                <input
                  type="text"
                  value={guarantor.applicantName}
                  onChange={(e) => handleChange(index, "applicantName", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">ID Number:</label>
                <input
                  type="text"
                  value={guarantor.applicantId}
                  onChange={(e) => handleChange(index, "applicantId", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Amount of Loan you are guaranteeing for (Kshs):</label>
                <input
                  type="number"
                  value={guarantor.loanAmount}
                  onChange={(e) => handleChange(index, "loanAmount", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Your Relationship with Primary Borrower:</label>
                <input
                  type="text"
                  value={guarantor.relationship}
                  onChange={(e) => handleChange(index, "relationship", e.target.value)}
                  className="guar-input"
                  placeholder="Business partner, Friend, Relative. Please specify"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Are you currently a Guarantor on any other loan in AEDT or other financial institutions:</label>
                <select
                  value={guarantor.otherGuarantee}
                  onChange={(e) => handleChange(index, "otherGuarantee", e.target.value)}
                  className="guar-input"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              {guarantor.otherGuarantee === "Yes" && (
                <>
                  <div className="guar-field">
                    <label className="guar-label">Amount:</label>
                    <input
                      type="number"
                      value={guarantor.otherGuaranteeAmount}
                      onChange={(e) => handleChange(index, "otherGuaranteeAmount", e.target.value)}
                      className="guar-input"
                    />
                  </div>
                  <div className="guar-field">
                    <label className="guar-label">Maturity Date:</label>
                    <input
                      type="date"
                      value={guarantor.maturityDate}
                      onChange={(e) => handleChange(index, "maturityDate", e.target.value)}
                      className="guar-input"
                    />
                  </div>
                </>
              )}
              <div className="guar-field">
                <label className="guar-label">Do you currently have a loan from the AEDT or other financial institutions?</label>
                <select
                  value={guarantor.currentLoan}
                  onChange={(e) => handleChange(index, "currentLoan", e.target.value)}
                  className="guar-input"
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Referees */}
          <div className="guar-section">
            <h5>Referees</h5>
            <div className="guar-grid">
              <div className="guar-field">
                <label className="guar-label">Referee (1) Name:</label>
                <input
                  type="text"
                  
                  value={guarantor.referee1Name}
                  onChange={(e) => handleChange(index, "referee1Name", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (1) Telephone No:</label>
                <input
                  type="tel"
                  value={guarantor.referee1Phone}
                  onChange={(e) => handleChange(index, "referee1Phone", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (1) Email Address:</label>
                <input
                  type="email"
                  value={guarantor.referee1Email}
                  onChange={(e) => handleChange(index, "referee1Email", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (2) Name:</label>
                <input
                  type="text"
                  value={guarantor.referee2Name}
                  onChange={(e) => handleChange(index, "referee2Name", e.target.value)}
                  className="guar-input"
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (2) Telephone No:</label>
                <input
                  type="tel"
                  value={guarantor.referee2Phone}
                  onChange={(e) => handleChange(index, "referee2Phone", e.target.value)}
                  className="guar-input"
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (2) Email Address:</label>
                <input
                  type="email"
                  value={guarantor.referee2Email}
                  onChange={(e) => handleChange(index, "referee2Email", e.target.value)}
                  className="guar-input"
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="guar-section">
            <h5>Document Uploads</h5>
            <div className="guar-grid">
              <div className="guar-field">
                <label className="guar-label">📄 Consent Letter (PDF/Image):</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, "consentFile", e.target.files[0])}
                  accept=".pdf,.jpg,.png"
                  className="guar-file"
                />
                {guarantor.consentFile && (
                  <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>
                    ✅ Selected: {guarantor.consentFile.name}
                  </p>
                )}
              </div>
              <div className="guar-field">
                <label className="guar-label">🆔 ID Document (PDF/Image):</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, "idFile", e.target.files[0])}
                  accept=".pdf,.jpg,.png"
                  className="guar-file"
                />
                {guarantor.idFile && (
                  <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>
                    ✅ Selected: {guarantor.idFile.name}
                  </p>
                )}
              </div>
              <div className="guar-field">
                <label className="guar-label">📸 Passport Photo (Image):</label>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(index, "photoFile", e.target.files[0])}
                  accept=".jpg,.png"
                  className="guar-file"
                />
                {guarantor.photoFile && (
                  <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>
                    ✅ Selected: {guarantor.photoFile.name}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="guar-buttons">
        <button
          onClick={handleBack}
          className="guar-button guar-button-back"
          disabled={uploading}
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleNext}
          className="guar-button guar-button-next"
          disabled={uploading}
        >
          {uploading ? "Uploading & Saving..." : "➡️ Next"}
        </button>
      </div>
    </Section>
  );
}