import { useState, useEffect } from "react";
import { studentAPI } from "../../api/api"; // ✅ replace axios
import StudentRequirements from "./StudentRequirements";
import ParentGuardianSection from "./ParentGuardianSection";
import EmploymentSection from "./EmploymentSection";
import FinancialSection from "./FinancialSection";
import LoanDetailsSection from "./LoanDetailsSection";
import BudgetPlannerSection from "./BudgetPlannerSection";
import RefereesSection from "./RefereesSection";
import RecommendationsSection from "./RecommendationsSection";
import GuarantorSection from "./GuarantorSection";
import ConsentPage from "./ConsentPage";
import SiblingsSection from "./SiblingsSection";

export default function ApplicationForm() {
  const [step, setStep] = useState(1);
  const [isLocked, setIsLocked] = useState(false);
  const [lockChecked, setLockChecked] = useState(false);

  const [formData, setFormData] = useState({
    program: "",
    personalDetails: {},
    educationalQualifications: {},
    documentsUploaded: {},
    parentGuardian: {},
    parentGuardianDocuments: {},
    employmentDetails: {},
    employmentDocuments: {},
    financialDetails: {},
    loanDetails: {},
    referees: {},
    budgetDetails: {},
    recommendations: {},
    guarantors: [],
    consentForm: {},
    siblings: {},
    student: {},
  });

  // ── Check lock status on mount ──
  useEffect(() => {
    const checkLockStatus = async () => {
      try {
        const res = await studentAPI.checkSubmissionStatus(); // ✅ no token needed
        setIsLocked(res.data.is_locked || false);
        if (res.data.is_locked && res.data.details) {
          setFormData(prev => ({ ...prev, ...res.data.details }));
        }
      } catch (err) {
        console.error("Could not check lock status:", err);
      } finally {
        setLockChecked(true);
      }
    };
    checkLockStatus();
  }, []);

  const updateFormData = (section, data) => {
    setFormData(prev => ({ ...prev, [section]: data }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 11));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const sharedProps = {
    formData,
    updateFormData,
    isLocked,
    onNext: nextStep,
    onBack: prevStep,
  };

  if (!lockChecked) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "200px",
        fontSize: "16px",
        color: "#2d6a9f",
        fontWeight: "600",
      }}>
        ⏳ Loading your application...
      </div>
    );
  }

  return (
    <div>
      {isLocked && (
        <div style={{
          background: "#fff8e1",
          border: "1px solid #f59e0b",
          borderRadius: "8px",
          padding: "14px 20px",
          margin: "16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          color: "#b45309",
          fontWeight: "600",
          fontSize: "14px",
        }}>
          🔒 Your previous application is locked and cannot be edited.
          You may view your submitted data below.
          A new application will be created when you submit again.
        </div>
      )}

      {step === 1 && <StudentRequirements {...sharedProps} />}
      {step === 2 && <ParentGuardianSection {...sharedProps} />}
      {step === 3 && <EmploymentSection {...sharedProps} />}
      {step === 4 && <FinancialSection {...sharedProps} />}
      {step === 5 && <LoanDetailsSection {...sharedProps} />}
      {step === 6 && <RefereesSection {...sharedProps} />}
      {step === 7 && <BudgetPlannerSection {...sharedProps} />}
      {step === 8 && <RecommendationsSection {...sharedProps} />}
      {step === 9 && <GuarantorSection {...sharedProps} program={formData.program} />}
      {step === 10 && <SiblingsSection {...sharedProps} />}
      {step === 11 && <ConsentPage {...sharedProps} />}
    </div>
  );
}