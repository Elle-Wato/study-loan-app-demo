import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";

const ConsentPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    studentDate: "",
    guardianName: "",
    guardianDate: "",
    guarantorName: "",
    guarantorDate: "",
  });

  const studentSigRef = useRef(null);
  const guardianSigRef = useRef(null);
  const guarantorSigRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Get signature data as base64 images
    const studentSignature = studentSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    const guardianSignature = guardianSigRef.current?.getTrimmedCanvas().toDataURL("image/png");
    const guarantorSignature = guarantorSigRef.current?.getTrimmedCanvas().toDataURL("image/png");

    // Combine form data
    const fullData = {
      ...formData,
      studentSignature,
      guardianSignature,
      guarantorSignature,
    };

    console.log("Consent Form Data:", fullData);
    // TODO: Send to backend or handle submission (e.g., API call)
    // Navigate to success page
    navigate("/success");
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const clearSignature = (ref) => {
    ref.current?.clear();
  };

  return (
    <div className="consent-bg">
      <div className="consent-container">
        <h1 className="consent-title">Consent Form for Loan Application</h1>
        <p className="consent-intro">
          I (We) consent to the collection, processing, transmission, and storage by the Trust in any form whatsoever, of any data of a professional or personal nature that have been provided by the applicant as stipulated in page one of the requirements which is necessary for the purposes of the loan application.
        </p>

        <form onSubmit={handleSubmit} className="consent-form">
          {/* Student Section */}
          <div className="consent-section">
            <h2>Student Consent</h2>
            <div className="form-group">
              <label>Student Name:</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Signature:</label>
              <div className="signature-container">
                <SignatureCanvas
                  ref={studentSigRef}
                  canvasProps={{ className: "signature-canvas" }}
                />
                <button type="button" onClick={() => clearSignature(studentSigRef)} className="clear-btn">
                  Clear
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="studentDate"
                value={formData.studentDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Guardian Section */}
          <div className="consent-section">
            <h2>Guardian Consent</h2>
            <div className="form-group">
              <label>Guardian Name:</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Signature:</label>
              <div className="signature-container">
                <SignatureCanvas
                  ref={guardianSigRef}
                  canvasProps={{ className: "signature-canvas" }}
                />
                <button type="button" onClick={() => clearSignature(guardianSigRef)} className="clear-btn">
                  Clear
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="guardianDate"
                value={formData.guardianDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="consent-buttons">
            <button type="button" onClick={handleBack} className="consent-button consent-button-back">
              ⬅️ Back
            </button>
            <button type="submit" className="consent-button consent-button-submit">
              ✅ Submit Consent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsentPage;