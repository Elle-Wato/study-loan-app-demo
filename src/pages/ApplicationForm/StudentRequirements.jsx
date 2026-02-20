import { useState, useEffect } from "react";
import { studentAPI } from "../../api/api";
import Section from "../../components/Section";
import ProgramSelect from "../../components/ProgramSelect";



export default function StudentRequirements({ onNext, formData, updateFormData }) {
  const defaultEducationalQualifications = {
    primary: { level: "", schoolName: "", period: "", grade: "" },
    secondary: { level: "", schoolName: "", period: "", grade: "" },
    postSecondary: { level: "", schoolName: "", period: "", grade: "" },
  };

  const [program, setProgram] = useState(formData.program || "");
  const [personalDetails, setPersonalDetails] = useState(formData.personalDetails || {});
  const [educationalQualifications, setEducationalQualifications] = useState(
    formData.educationalQualifications && Object.keys(formData.educationalQualifications).length > 0
      ? formData.educationalQualifications
      : defaultEducationalQualifications
  );

  const [files, setFiles] = useState({
    cv: null,
    form4Certificate: null,
    schoolLeavingCertificate: null,
    admissionLetter: null,
    nationalID: null,
    kraPinDoc: null,
    passportPhoto: null,
    loanEssay: null,
  });

  const [uploadedUrls, setUploadedUrls] = useState(() => formData.documentsUploaded || {});

  // Update parent formData on changes
  useEffect(() => {
    updateFormData("program", program);
  }, [program]);

  useEffect(() => {
    updateFormData("personalDetails", personalDetails);
  }, [personalDetails]);

  useEffect(() => {
    updateFormData("educationalQualifications", educationalQualifications);
  }, [educationalQualifications]);

  useEffect(() => {
  updateFormData("documentsUploaded", uploadedUrls);
}, [uploadedUrls]);

  // Handlers for text inputs
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

  // Handlers for file inputs
  const handleFileChange = (e) => {
  const { name, files: selectedFiles } = e.target;
  if (selectedFiles && selectedFiles[0]) {
    setFiles(prev => ({ ...prev, [name]: selectedFiles[0] }));
    uploadFile(selectedFiles[0]).then(url => {
      setUploadedUrls(prev => ({ ...prev, [name]: url }));
    });
  }
};


  // Upload file helper
  const uploadFile = async (file) => {
  const formDataUpload = new FormData();
  formDataUpload.append("file", file);
  const res = await studentAPI.uploadFile(formDataUpload);
  return res.data.file_url;
};

  const handleNext = async () => {
  if (!program) {
    alert("Please select a program before proceeding.");
    return;
  }
  try {
    const payload = {
      program,
      personalDetails,
      educationalQualifications,
      documentsUploaded: uploadedUrls,
    };
    await studentAPI.updateDetails(payload);
    onNext();
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Failed to save data.");
  }
};


   const primary = educationalQualifications.primary || defaultEducationalQualifications.primary;
  const secondary = educationalQualifications.secondary || defaultEducationalQualifications.secondary;
  const postSecondary = educationalQualifications.postSecondary || defaultEducationalQualifications.postSecondary;

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

      {/* Personal Details */}
      <div className="req-section">
        <h3>A. Student Personal Details</h3>
        <div className="req-grid">
          {/* Render all personal details inputs with handlers and values */}
          <input name="fullName" placeholder="1. Full Name as per ID" value={personalDetails.fullName} onChange={handlePersonalChange} required className="req-input" />
          <input name="nationality" placeholder="2. Nationality" value={personalDetails.nationality} onChange={handlePersonalChange} required className="req-input" />
          <input name="idPassportNo" placeholder="3. ID/Passport No." value={personalDetails.idPassportNo} onChange={handlePersonalChange} required className="req-input" />
          <input type="date" name="dateOfBirth" placeholder="4. Date of Birth" value={personalDetails.dateOfBirth} onChange={handlePersonalChange} required className="req-input" />
          <input name="maritalStatus" placeholder="5. Marital Status" value={personalDetails.maritalStatus} onChange={handlePersonalChange} required className="req-input" />
          <input type="number" name="noOfChildren" placeholder="6. No. of Children" value={personalDetails.noOfChildren} onChange={handlePersonalChange} className="req-input" />
          <input type="tel" name="telephoneNo" placeholder="7. Telephone No." value={personalDetails.telephoneNo} onChange={handlePersonalChange} required className="req-input" />
          <input name="kraPin" placeholder="8. KRA PIN" value={personalDetails.kraPin} onChange={handlePersonalChange} required className="req-input" />
          <input name="county" placeholder="9. County" value={personalDetails.county} onChange={handlePersonalChange} required className="req-input" />
          <input name="postalAddress" placeholder="10. Postal Address" value={personalDetails.postalAddress} onChange={handlePersonalChange} required className="req-input" />
          <input name="poBox" placeholder="P. O. Box" value={personalDetails.poBox} onChange={handlePersonalChange} className="req-input" />
          <input name="socialMedia" placeholder="12. Social media accounts (e.g., Facebook)" value={personalDetails.socialMedia} onChange={handlePersonalChange} className="req-input" />
          <input name="residentialAddress" placeholder="13. Residential Address" value={personalDetails.residentialAddress} onChange={handlePersonalChange} required className="req-input" />
          <input name="permanentHomeAddress" placeholder="14. Permanent Home Address" value={personalDetails.permanentHomeAddress} onChange={handlePersonalChange} required className="req-input" />
          <input type="email" name="emailAddress" placeholder="15. Email Address" value={personalDetails.emailAddress} onChange={handlePersonalChange} required className="req-input" />
        </div>
      </div>

      {/* Educational Qualifications */}
      <div className="req-section">
        <h3>B. Educational Qualification</h3>

        {/* Primary School */}
        <div className="education-section">
          <h4>a. Primary School</h4>
          <div className="req-grid">
            <input placeholder="Level" value={educationalQualifications.primary.level} onChange={e => handleEducationChange("primary", "level", e.target.value)} className="req-input" />
            <input placeholder="Name of school" value={educationalQualifications.primary.schoolName} onChange={e => handleEducationChange("primary", "schoolName", e.target.value)} className="req-input" />
            <input placeholder="Period" value={educationalQualifications.primary.period} onChange={e => handleEducationChange("primary", "period", e.target.value)} className="req-input" />
            <input placeholder="Grade attained" value={educationalQualifications.primary.grade} onChange={e => handleEducationChange("primary", "grade", e.target.value)} className="req-input" />
          </div>
        </div>

        {/* Secondary School */}
        <div className="education-section">
          <h4>b. Secondary School</h4>
          <div className="req-grid">
            <input placeholder="Level" value={educationalQualifications.secondary.level} onChange={e => handleEducationChange("secondary", "level", e.target.value)} className="req-input" />
            <input placeholder="Name of school" value={educationalQualifications.secondary.schoolName} onChange={e => handleEducationChange("secondary", "schoolName", e.target.value)} className="req-input" />
            <input placeholder="Period" value={educationalQualifications.secondary.period} onChange={e => handleEducationChange("secondary", "period", e.target.value)} className="req-input" />
            <input placeholder="Grade attained" value={educationalQualifications.secondary.grade} onChange={e => handleEducationChange("secondary", "grade", e.target.value)} className="req-input" />
          </div>
        </div>

        {/* Post Secondary */}
        <div className="education-section">
          <h4>c. Post-Secondary</h4>
          <div className="req-grid">
            <input placeholder="Level" value={educationalQualifications.postSecondary.level} onChange={e => handleEducationChange("postSecondary", "level", e.target.value)} className="req-input" />
            <input placeholder="Name of school" value={educationalQualifications.postSecondary.schoolName} onChange={e => handleEducationChange("postSecondary", "schoolName", e.target.value)} className="req-input" />
            <input placeholder="Period" value={educationalQualifications.postSecondary.period} onChange={e => handleEducationChange("postSecondary", "period", e.target.value)} className="req-input" />
            <input placeholder="Grade attained" value={educationalQualifications.postSecondary.grade} onChange={e => handleEducationChange("postSecondary", "grade", e.target.value)} className="req-input" />
          </div>
        </div>
      </div>

      {/* Document Uploads */}
      <div className="req-section">
        <h3>Document Uploads</h3>
        <div className="req-grid">
          <div className="req-field">
            <label className="req-label" htmlFor="cv-upload">📄 Curriculum Vitae (CV)</label>
            <input type="file" name="cv" id="cv-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.cv && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.cv} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="form4-upload">📜 Form 4 Certificate</label>
            <input type="file" name="form4Certificate" id="form4-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.form4Certificate && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.form4Certificate} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="school-leaving-upload">🏫 School Leaving Certificate</label>
            <input type="file" name="schoolLeavingCertificate" id="school-leaving-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.schoolLeavingCertificate && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.schoolLeavingCertificate} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="admission-letter-upload">🎓 University Admission Letter</label>
            <input type="file" name="admissionLetter" id="admission-letter-upload" className="req-file" onChange={handleFileChange} />
              {uploadedUrls.admissionLetter && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.admissionLetter} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="id-upload">🆔 National ID</label>
            <input type="file" name="nationalID" id="id-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.nationalID && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.nationalID} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="kra-upload">📋 KRA PIN</label>
            <input type="file" name="kraPinDoc" id="kra-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.kraPinDoc && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.kraPinDoc} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="passport-photo-upload">📸 Passport Size Photo</label>
            <input type="file" name="passportPhoto" id="passport-photo-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.passportPhoto && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.passportPhoto} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
          <div className="req-field">
            <label className="req-label" htmlFor="essay-upload">✍️ 300-word Loan Justification Essay</label>
            <input type="file" name="loanEssay" id="essay-upload" className="req-file" onChange={handleFileChange} />
            {uploadedUrls.loanEssay && (
    <div style={{ marginTop: "5px", fontSize: "14px" }}>
      ✅ Uploaded |
      <a href={uploadedUrls.loanEssay} target="_blank" rel="noopener noreferrer">
        View File
      </a>
    </div>
  )}
          </div>
        </div>
      </div>

      <button onClick={handleNext} className="req-button">
        ➡️ Next
      </button>
    </Section>
  );
}