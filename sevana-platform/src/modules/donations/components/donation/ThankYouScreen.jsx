import { Link } from "react-router-dom";
import { useDonation } from "../../context/useDonation";
import ReceiptPreview from "./ReceiptPreview";
import XPRewardBanner from "./XPRewardBanner";
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
        Your demo contribution of <strong>₹{donation.amount.toLocaleString("en-IN")}</strong> was recorded in this browser. This checkout does not transfer money or provide disbursement proof.
      </p>

      <ReceiptPreview donation={donation} campaign={campaign} />

      <XPRewardBanner amount={donation.amount} />
      {donation.receiptId && <p className="thank-you-screen__receipt-id">Receipt {donation.receiptId} · {donation.xpEarned || 0} XP recorded in this browser</p>}

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
