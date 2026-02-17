import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SignaturePad from "signature_pad";

const API_BASE_URL = "http://127.0.0.1:5000";

const ConsentPage = ({ onBack }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentName: "",
    studentDate: "",
    guardianName: "",
    guardianDate: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Refs for canvas elements
  const studentCanvasRef = useRef(null);
  const guardianCanvasRef = useRef(null);

  // SignaturePad instances
  const studentSigPad = useRef(null);
  const guardianSigPad = useRef(null);

  // Initialize SignaturePad on mount
  useEffect(() => {
    if (studentCanvasRef.current) {
      studentSigPad.current = new SignaturePad(studentCanvasRef.current);
    }
    if (guardianCanvasRef.current) {
      guardianSigPad.current = new SignaturePad(guardianCanvasRef.current);
    }

    // Cleanup on unmount
    return () => {
      studentSigPad.current?.off();
      guardianSigPad.current?.off();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Get signature data as base64 images
      const studentSignature = studentSigPad.current?.isEmpty() 
        ? null 
        : studentSigPad.current.toDataURL("image/png");
      const guardianSignature = guardianSigPad.current?.isEmpty() 
        ? null 
        : guardianSigPad.current.toDataURL("image/png");

      // Check if signatures are provided
      if (!studentSignature || !guardianSignature) {
        alert("Please provide both student and guardian signatures before submitting.");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to submit.");
        return;
      }

      setSubmitting(true);

      // Step 1: Save consent form data to student.details
      const consentData = {
        consentForm: {
          studentName: formData.studentName,
          studentDate: formData.studentDate,
          studentSignature,
          guardianName: formData.guardianName,
          guardianDate: formData.guardianDate,
          guardianSignature,
          submittedAt: new Date().toISOString(),
        }
      };

      console.log("Saving consent form...");
      await axios.patch(
        `${API_BASE_URL}/admin/students/update-details`,
        consentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Consent form saved");

      // Step 2: Submit the application
      console.log("Submitting application...");
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

      // Navigate to success page
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

  const clearSignature = (sigPad) => {
    sigPad.current?.clear();
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
                value={formData.guardianDate}
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