import { useState } from "react";
import ProgramSelect from "../../components/ProgramSelect";
import DocumentUpload from "../../components/DocumentUpload";
import { useNavigate } from "react-router-dom";

export default function ApplicationForm() {
  const navigate = useNavigate();
  const [program, setProgram] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    university: "",
    amount: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ program, formData });
    navigate("/success");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Loan Application Form</h2>

      <ProgramSelect
        value={program}
        onChange={(e) => setProgram(e.target.value)}
      />

      <input
        placeholder="Full Name"
        onChange={(e) =>
          setFormData({ ...formData, fullName: e.target.value })
        }
        required
      />

      <input
        placeholder="ID Number"
        required
      />

      <input
        placeholder="Phone Number"
        required
      />

      <input
        placeholder="University / College"
        required
      />

      <input
        placeholder="Amount Applied (Ksh)"
        required
      />

      <DocumentUpload />

      <button type="submit">Submit Application</button>
    </form>
  );
}
