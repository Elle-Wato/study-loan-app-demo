import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignaturePad from "signature_pad";

const API_BASE_URL = "http://127.0.0.1:5000";

const ConsentPage = ({ onBack, formData, updateFormData }) => {
  const navigate = useNavigate();
  // Initialize local state from formData.consentForm or defaults
  const [formDataLocal, setFormDataLocal] = useState({
    studentName: formData.consentForm?.studentName || "",
    studentDate: formData.consentForm?.studentDate || "",
    guardianName: formData.consentForm?.guardianName || "",
    guardianDate: formData.consentForm?.guardianDate || "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Refs for signature pads
  const studentCanvasRef = useRef(null);
  const guardianCanvasRef = useRef(null);
  const studentSigPad = useRef(null);
  const guardianSigPad = useRef(null);

  // Initialize signature pads on mount
  useEffect(() => {
    if (studentCanvasRef.current) {
      studentSigPad.current = new SignaturePad(studentCanvasRef.current);
      // If signature image exists in formData, load it as initial image
      if (formData.consentForm?.studentSignature) {
        studentSigPad.current.fromDataURL(formData.consentForm.studentSignature);
      }
    }
    if (guardianCanvasRef.current) {
      guardianSigPad.current = new SignaturePad(guardianCanvasRef.current);
      if (formData.consentForm?.guardianSignature) {
        guardianSigPad.current.fromDataURL(formData.consentForm.guardianSignature);
      }
    }
    return () => {
      studentSigPad.current?.off();
      guardianSigPad.current?.off();
    };
  }, [formData.consentForm]);

  // Sync local form inputs with formData in parent on changes
  useEffect(() => {
    updateFormData("consentForm", {
      ...formData.consentForm,
      studentName: formDataLocal.studentName,
      studentDate: formDataLocal.studentDate,
      guardianName: formDataLocal.guardianName,
      guardianDate: formDataLocal.guardianDate,
    });
  }, [formDataLocal]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataLocal((prev) => ({ ...prev, [name]: value }));
  };

  const clearSignature = (sigPad) => {
    sigPad.current?.clear();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const studentSignature = studentSigPad.current?.isEmpty()
      ? null
      : studentSigPad.current.toDataURL("image/png");
    const guardianSignature = guardianSigPad.current?.isEmpty()
      ? null
      : guardianSigPad.current.toDataURL("image/png");

    if (!studentSignature || !guardianSignature) {
      alert("Please provide both student and guardian signatures before submitting.");
      return;
    }

    // Compose the full consent form data to save, merging with any existing consentForm
    const consentData = {
      ...formData.consentForm,
      studentName: formDataLocal.studentName,
      studentDate: formDataLocal.studentDate,
      studentSignature,
      guardianName: formDataLocal.guardianName,
      guardianDate: formDataLocal.guardianDate,
      guardianSignature,
      submittedAt: new Date().toISOString(),
    };

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }

    setSubmitting(true);
    try {
      // Save consent form data to backend
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        { consentForm: consentData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Consent form saved");

      // Submit application
      const response = await axios.post(
        `${API_BASE_URL}/submissions/submit`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Application submitted:", response.data);
      alert("Application submitted successfully!");
      navigate("/success");
    } catch (error) {
      console.error("❌ Submission error:", error.response?.data || error);
      alert(error.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  return (
    <div className="consent-bg">
      <div className="consent-container">
        <h1 className="consent-title">Consent Form for Loan Application</h1>
        <p className="consent-intro">
          I (We) consent to the collection, processing, transmission, and storage by the Trust in any form whatsoever, of any data of a professional or personal nature that have been provided by the applicant as stipulated in page one of the requirements which is necessary for the purposes of the loan application.
        </p>

        <form onSubmit={handleSubmit} className="consent-form">

          <div className="consent-section">
            <h2>Student Consent</h2>
            <div className="form-group">
              <label>Student Name:</label>
              <input
                type="text"
                name="studentName"
                value={formDataLocal.studentName}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Signature:</label>
              <div className="signature-container">
                <canvas
                  ref={studentCanvasRef}
                  className="signature-canvas"
                  width={400}
                  height={200}
                />
                <button
                  type="button"
                  onClick={() => clearSignature(studentSigPad)}
                  className="clear-btn"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="studentDate"
                value={formDataLocal.studentDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="consent-section">
            <h2>Guardian Consent</h2>
            <div className="form-group">
              <label>Guardian Name:</label>
              <input
                type="text"
                name="guardianName"
                value={formDataLocal.guardianName}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Signature:</label>
              <div className="signature-container">
                <canvas
                  ref={guardianCanvasRef}
                  className="signature-canvas"
                  width={400}
                  height={200}
                />
                <button
                  type="button"
                  onClick={() => clearSignature(guardianSigPad)}
                  className="clear-btn"
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="guardianDate"
                value={formDataLocal.guardianDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="consent-buttons">
            <button
              type="button"
              onClick={handleBack}
              className="consent-button consent-button-back"
              disabled={submitting}
            >
              ⬅️ Back
            </button>
            <button
              type="submit"
              className="consent-button consent-button-submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "✅ Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsentPage;