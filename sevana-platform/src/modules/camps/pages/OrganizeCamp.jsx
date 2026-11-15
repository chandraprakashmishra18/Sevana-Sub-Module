import { useState } from "react";
import CampDetailsForm from "../components/organize/CampDetailsForm";
import MediaUploadForm from "../components/organize/MediaUploadForm";
import OrganizerReview from "../components/organize/OrganizerReview";
import { useAuth } from "../../../shared/useAuth";
import "./OrganizeCamp.css";

const initialFormData = {
  title: "",
  type: "",
  targetBeneficiary: "",
  date: "",
  startTime: "09:00",
  endTime: "16:00",
  location: "",
  description: "",
  workerRolesNeeded: "",
  media: [],
};

function OrganizeCamp() {
  const { activeOrganization } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(initialFormData);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <section className="organize-page">
      <div className="container organize-page__container">
        <div className="organize-page__card">
          <div className="organize-page__header">
            <h1>Organize a Camp</h1>
            <p>Create a draft for {activeOrganization?.name}. Publishing requires organization verification.</p>
          </div>

          <div className="organize-page__progress">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`organize-page__dot ${step >= s ? "organize-page__dot--active" : ""}`} />
            ))}
          </div>

          {step === 1 && (
            <CampDetailsForm formData={formData} updateFormData={updateFormData} onNext={nextStep} />
          )}
          {step === 2 && (
            <MediaUploadForm formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />
          )}
          {step === 3 && (
            <OrganizerReview formData={formData} organizationId={activeOrganization?.id} onBack={prevStep} />
          )}
        </div>
      </div>
    </section>
  );
}

export default OrganizeCamp;
