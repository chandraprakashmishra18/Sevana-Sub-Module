import { Link } from "react-router-dom";
import { useDonation } from "../../context/useDonation";
import ReceiptPreview from "./ReceiptPreview";
import Button from "../common/Button";
import mockCampaigns from "../../data/mockCampaigns";
import "./ThankYouScreen.css";

function ThankYouScreen() {
  const { donation } = useDonation();
  const campaign = mockCampaigns.find((c) => c.id === donation.campaignId);

  return (
    <div className="thank-you-screen">
      <div className="thank-you-screen__icon">🎉</div>
      <h2>Thank you, {donation.anonymous ? "Friend" : donation.donorName.split(" ")[0]}!</h2>
      <p>
        Your donation of <strong>₹{donation.amount.toLocaleString("en-IN")}</strong> has
        been received. You'll get photo-verified proof once the funds are used.
      </p>

      <ReceiptPreview donation={donation} campaign={campaign} />

      <div className="thank-you-screen__actions">
        <Link to="/campaigns">
          <Button variant="outline">Browse More Campaigns</Button>
        </Link>
        {campaign && (
          <Link to={`/campaigns/${campaign.id}`}>
            <Button variant="primary">Track This Campaign</Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default ThankYouScreen;