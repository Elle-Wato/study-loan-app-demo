import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import logo from "../../assets/logo.png";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const printRef = useRef();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStudents(res.data);
      setError("");
    } catch {
      setError("You are not authorized to view this page");
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedStudent(res.data);
    } catch {
      alert("Failed to fetch student details");
    }
  };

  const updateStatus = async (studentId, status) => {
    try {
      await axios.patch(
        `${API_BASE_URL}/staff/submission/${studentId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStudents();
      setSelectedStudent(null);
    } catch {
      alert("Failed to update status");
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Application_${selectedStudent?.name || "Student"}`
  });

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const safeParseJSON = (details) => {
    if (!details) return {};
    try {
      return typeof details === "string" ? JSON.parse(details) : details;
    } catch {
      return {};
    }
  };

  // Helper: get nested value safely
  const getDetailValue = (details, pathArray) => {
    if (!details) return null;
    let obj = safeParseJSON(details);
    return pathArray.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  };

  const getStudentName = (student) => {
    return (
      student.name ||
      getDetailValue(student.details, ["personalDetails", "fullName"]) ||
      getDetailValue(student.details, ["studentName"]) ||
      "N/A"
    );
  };

  const getStudentCourse = (student) => {
  return student.course || student.loan_studyProgram || "N/A";
};

const getStudentInstitution = (student) => {
  return student.institution || student.loan_universityName || "N/A";
};

const getStudentProgram = (student) => {
  return student.program || "N/A";
};

const getStudentEmail = (student) => {
  return student.email || "N/A";
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
                <th>Program</th>
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
                  <td>{getStudentName(s)}</td>
                  <td>{getStudentProgram(s)}</td>
                  <td className={`status ${s.status}`}>
                    {s.status.toUpperCase()}
                  </td>
                  <td>{s.submitted_at ? new Date(s.submitted_at).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button className="approve-btn" onClick={() => updateStatus(s.id, "approved")}>Approve</button>
                    <button className="reject-btn" onClick={() => updateStatus(s.id, "rejected")}>Reject</button>
                  </td>
                  <td>
                    <button onClick={() => fetchStudentDetails(s.id)}>
                      View Full Application
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FULL APPLICATION MODAL */}
        {selectedStudent && (
          <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div ref={printRef} className="printable-application">
                <h1>Full Loan Application Review</h1>

                <p><strong>Name:</strong> {getStudentName(selectedStudent)}</p>
                <p><strong>Email:</strong> {getStudentEmail(selectedStudent)}</p>
                <p><strong>Program:</strong> {getStudentProgram(selectedStudent)}</p>
                <p><strong>Status:</strong> {selectedStudent.status.toUpperCase()}</p>
                <p><strong>Submitted At:</strong> {selectedStudent.submitted_at ? new Date(selectedStudent.submitted_at).toLocaleDateString() : "N/A"}</p>

                <h2>Academic Information</h2>
                <p><strong>Course:</strong> {getStudentCourse(selectedStudent)}</p>
                <p><strong>Institution:</strong> {getStudentInstitution(selectedStudent)}</p>

                <h2>Parent / Guardian</h2>
                <p><strong>Name:</strong> {selectedStudent.parent_name || "N/A"}</p>
                <p><strong>Phone:</strong> {selectedStudent.parent_phone || "N/A"}</p>

                <h2>Uploaded Documents</h2>
                {selectedStudent.documents && selectedStudent.documents.length > 0 ? (
                  <ul>
                    {selectedStudent.documents.map(doc => (
                      <li key={doc.id}>
                        <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                          View Document
                        </a>{" "}
                        ({new Date(doc.uploaded_at).toLocaleDateString()})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No documents uploaded.</p>
                )}
              </div>

              <div className="modal-actions">
                <button onClick={handlePrint}>📄 Download / Print</button>
                <button className="approve-btn" onClick={() => updateStatus(selectedStudent.id, "approved")}>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => updateStatus(selectedStudent.id, "rejected")}>
                  Reject
                </button>
                <button onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}