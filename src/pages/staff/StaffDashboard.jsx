import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";  // For printing/downloading
import logo from "../../assets/logo.png";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);  // For full view modal
  const printRef = useRef();  // Ref for printing

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchStudents();
  }, []);

  // Fetch list of all students (summary)
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      setError("");
    } catch (err) {
      setError("You are not authorized to view this page");
    } finally {
      setLoading(false);
    }
  };

  // Fetch full details of a single student, including documents and loan details
  const fetchStudentDetails = async (studentId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedStudent(res.data);
    } catch (err) {
      alert("Failed to fetch student details");
    }
  };

  // Update status (approved/rejected) for a student submission
  const updateStatus = async (studentId, status) => {
    try {
      await axios.patch(`${API_BASE_URL}/staff/submission/${studentId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents();          // Refresh the list
      setSelectedStudent(null); // Close modal after action
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Print/download the full application
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Application_${selectedStudent?.name || 'Student'}`,
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <div className="staff-bg">
      <header className="staff-header">
        <img src={logo} alt="Logo" className="staff-logo" />
        <h2>📋 Staff Dashboard</h2>
        <button onClick={logout} className="staff-logout">Logout</button>
      </header>

      <div className="staff-container">
        {loading && <p>Loading applications...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && students.length === 0 && <p>No applications submitted yet.</p>}

        {!loading && students.length > 0 && (
          <table className="staff-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Status</th>
                <th>Submitted At</th>
                <th>Actions</th>
                <th>Full Application</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, index) => (
                <tr key={s.id}>
                  <td>{index + 1}</td>
                  <td>{s.name || 'N/A'}</td>
                  <td><span className={`status ${s.status}`}>{s.status.toUpperCase()}</span></td>
                  <td>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <button className="approve-btn" onClick={() => updateStatus(s.id, "approved")}>Approve</button>
                    <button className="reject-btn" onClick={() => updateStatus(s.id, "rejected")}>Reject</button>
                  </td>
                  <td>
                    <button onClick={() => fetchStudentDetails(s.id)}>View Full Application</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Full Application Modal */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div ref={printRef} className="printable-application">
                <h1>Full Loan Application Review</h1>
                <p><strong>Student Name:</strong> {selectedStudent.name || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedStudent.status.toUpperCase()}</p>
                <p><strong>Submitted At:</strong> {selectedStudent.submitted_at ? new Date(selectedStudent.submitted_at).toLocaleDateString() : 'N/A'}</p>

                {/* Render details as formatted sections */}
                {selectedStudent.details && Object.keys(selectedStudent.details).length > 0 ? (
                  <div>
                    <h2>Student Requirements</h2>
                    <p><strong>Name:</strong> {selectedStudent.details.studentName || 'N/A'}</p>
                    <p><strong>Email:</strong> {selectedStudent.details.email || 'N/A'}</p>
                    <p><strong>Course:</strong> {selectedStudent.details.course || 'N/A'}</p>
                    <p><strong>Institution:</strong> {selectedStudent.details.institution || 'N/A'}</p>

                    <h2>Parent/Guardian Information</h2>
                    <p><strong>Name:</strong> {selectedStudent.details.guardianName || 'N/A'}</p>
                    <p><strong>Occupation:</strong> {selectedStudent.details.guardianOccupation || 'N/A'}</p>

                    <h2>Employment Information</h2>
                    <p><strong>Employed:</strong> {selectedStudent.details.isEmployed ? 'Yes' : 'No'}</p>
                    <p><strong>Employer:</strong> {selectedStudent.details.employer || 'N/A'}</p>

                    <h2>Financial Information</h2>
                    <p><strong>Monthly Income:</strong> {selectedStudent.details.monthlyIncome || 'N/A'}</p>

                    <h2>Loan Details</h2>
                    <p><strong>Amount Requested:</strong> {selectedStudent.details.loanAmount || 'N/A'}</p>

                    <h2>Signatures</h2>
                    {selectedStudent.details.studentSignature && (
                      <div>
                        <p><strong>Student Signature:</strong></p>
                        <img src={selectedStudent.details.studentSignature} alt="Student Signature" style={{ maxWidth: '200px' }} />
                      </div>
                    )}
                    {selectedStudent.details.guardianSignature && (
                      <div>
                        <p><strong>Guardian Signature:</strong></p>
                        <img src={selectedStudent.details.guardianSignature} alt="Guardian Signature" style={{ maxWidth: '200px' }} />
                      </div>
                    )}
                    {selectedStudent.details.guarantorSignature && (
                      <div>
                        <p><strong>Guarantor Signature:</strong></p>
                        <img src={selectedStudent.details.guarantorSignature} alt="Guarantor Signature" style={{ maxWidth: '200px' }} />
                      </div>
                    )}

                    <h2>Uploaded Documents</h2>
                    {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                      <ul>
                        {selectedStudent.documents.map(doc => (
                          <li key={doc.id}>
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer">View Document</a>
                            {' '} (Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No documents uploaded.</p>
                    )}
                  </div>
                ) : (
                  <p>No details available.</p>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={handlePrint}>📄 Download/Print PDF</button>
                <button className="approve-btn" onClick={() => updateStatus(selectedStudent.id, "approved")}>Approve</button>
                <button className="reject-btn" onClick={() => updateStatus(selectedStudent.id, "rejected")}>Reject</button>
                <button onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}