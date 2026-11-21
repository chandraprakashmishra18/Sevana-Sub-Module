import { Link } from "react-router-dom";
import { useDonation } from "../../context/useDonation";
import { findCampaignSync } from "../../services/campaignService";
import "./ThankYouScreen.css";

function ThankYouScreen() {
  const { donation } = useDonation();
  const campaign = findCampaignSync(donation.campaignId);

  return (
    <div className="thank-you-screen">
      
      <h2>Thank you, {donation.anonymous ? "Friend" : donation.donorName.split(" ")[0]}!</h2>
      <p>
        Your donation intent of <strong>₹{Number(donation.amount).toLocaleString("en-IN")}</strong> is stored as <strong>pending</strong>. No payment has been processed.
      </p>
      {donation.donationIntentId && <p className="thank-you-screen__receipt-id">Donation intent reference: {donation.donationIntentId}</p>}

      <div className="thank-you-screen__actions">
        <Link to="/campaigns" className="btn btn--outline btn--md">Browse More Campaigns</Link>
        {campaign && (
          <Link to={`/campaigns/${campaign.id}`} className="btn btn--primary btn--md">Track This Campaign</Link>
        )}
      </div>
    </div>
  );
}

export default ThankYouScreen;
