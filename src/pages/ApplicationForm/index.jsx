import { useState } from "react";
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

//import StudentSection from "./StudentSection";

export default function ApplicationForm() {
  const [step, setStep] = useState(1); // current section

  // Centralized form data state for all sections
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

  // Update a specific section's data in formData
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 11));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div>
      {step === 1 && (
        <StudentRequirements onNext={nextStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 2 && (
        <ParentGuardianSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 3 && (
        <EmploymentSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 4 && (
        <FinancialSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 5 && (
        <LoanDetailsSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 6 && (
        <RefereesSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 7 && (
        <BudgetPlannerSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 8 && (
        <RecommendationsSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 9 && (
        <GuarantorSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} program={formData.program} />
      )}
      {step === 10 && (
        <SiblingsSection onNext={nextStep} onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
      {step === 11 && (
        <ConsentPage onBack={prevStep} formData={formData} updateFormData={updateFormData} />
      )}
    </div>
  );
}