import { useState } from "react";
import Section from "../../components/Section";

export default function GuarantorSection({ onNext, onBack, program }) {
  const isPostgraduate = program === "Postgraduate";
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
    }))
  );

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

  const handleNext = () => {
    // Add validation if needed
    onNext();
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
        📝 Download, print, fill, sign, then upload the documents below. 
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
                <label className="guar-label">Applicant’s Name:</label>
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
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (2) Telephone No:</label>
                <input
                  type="tel"
                  value={guarantor.referee2Phone}
                  onChange={(e) => handleChange(index, "referee2Phone", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
              <div className="guar-field">
                <label className="guar-label">Referee (2) Email Address:</label>
                <input
                  type="email"
                  value={guarantor.referee2Email}
                  onChange={(e) => handleChange(index, "referee2Email", e.target.value)}
                  className="guar-input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div className="guar-grid">
            <div className="guar-item">
              <a href="/guarantor-consent.pdf" download className="guar-link">
                ⬇️ Download Guarantor Consent Form
              </a>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, "consentFile", e.target.files[0])}
                className="guar-file"
              />
            </div>
            <div className="guar-item">
              <label className="guar-label">🆔 Upload ID</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, "idFile", e.target.files[0])}
                className="guar-file"
              />
            </div>
            <div className="guar-item">
              <label className="guar-label">📸 Upload Passport Size Photo</label>
              <input
                type="file"
                onChange={(e) => handleFileChange(index, "photoFile", e.target.files[0])}
                className="guar-file"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="guar-buttons">
        <button onClick={handleBack} className="guar-button guar-button-back">
          ⬅️ Back
        </button>
        <button onClick={handleNext} className="guar-button guar-button-next">
          ➡️ Next
        </button>
      </div>
    </Section>
  );
}