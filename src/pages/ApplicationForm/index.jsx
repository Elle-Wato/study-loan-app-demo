// src/pages/ApplicationForm/index.jsx
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
// import other sections here

export default function ApplicationForm() {
  const [step, setStep] = useState(1); // current section

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <StudentRequirements onNext={nextStep} />}
      {step === 2 && (
        <ParentGuardianSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 3 && (
        <EmploymentSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 4 && (
        <FinancialSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 5 && (
        <LoanDetailsSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 6 && (
        <RefereesSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 7 && (
        <BudgetPlannerSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 8 && (
        <RecommendationsSection onNext={nextStep} onBack={prevStep} />
      )}
      {step === 9 && (
        <GuarantorSection
          onNext={nextStep} // Added to proceed to ConsentPage
          onBack={prevStep}
        />
      )}
      {step === 10 && (
        <ConsentPage
          onBack={prevStep}
          // You can add onSubmit here if needed, e.g., to handle final submission
        />
      )}
    </div>
  );
}