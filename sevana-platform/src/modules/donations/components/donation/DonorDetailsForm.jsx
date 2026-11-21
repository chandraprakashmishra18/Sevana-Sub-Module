import { useDonation } from "../../context/useDonation";
import { useAuth } from "../../../../shared/useAuth";
import Button from "../common/Button";
import "./DonorDetailsForm.css";

function DonorDetailsForm() {
  const { donation, updateDonation, nextStep, prevStep } = useDonation();
  const { user } = useAuth();
  const fullName = user?.fullName || user?.name || "Your Sevana account";
  return <div className="donation-step"><h2>Step 2 of 4 — Your Details</h2><p>Donation intent will be associated with your signed-in account: <strong>{fullName}</strong> ({user?.email}).</p>
    <label className="donation-step__checkbox"><input type="checkbox" checked={donation.anonymous} onChange={(event) => updateDonation({ anonymous: event.target.checked })}/><span>Keep your identity private on public campaign records</span></label>
    <div className="donation-step__actions"><Button variant="ghost" onClick={prevStep}>← Back</Button><Button variant="accent" size="lg" onClick={nextStep}>Continue</Button></div>
  </div>;
}

export default DonorDetailsForm;
