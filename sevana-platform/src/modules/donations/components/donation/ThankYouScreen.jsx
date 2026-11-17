import { Link } from "react-router-dom";
import { useDonation } from "../../context/useDonation";
import ReceiptPreview from "./ReceiptPreview";
import XPRewardBanner from "./XPRewardBanner";
import { findCampaignSync } from "../../services/campaignService";
import { getUsers } from "../../services/authService";
import "./ThankYouScreen.css";

function ThankYouScreen() {
  const { donation } = useDonation();
  const campaign = findCampaignSync(donation.campaignId);

  // XP is only saved when the donor's email matches a registered account.
  const email = String(donation.donorEmail || "").toLowerCase().trim();
  const account = getUsers().find((u) => String(u.email || "").toLowerCase() === email);
  const earnedXP = donation.xpEarned || 0;
  // The account's XP already includes this donation, so subtract it to get the "before" value.
  const previousXP = account ? Math.max(0, (account.totalXP || 0) - earnedXP) : 0;

  return (
    <div className="thank-you-screen">
      
      <h2>Thank you, {donation.anonymous ? "Friend" : donation.donorName.split(" ")[0]}!</h2>
      <p>
        Your demo contribution of <strong>₹{donation.amount.toLocaleString("en-IN")}</strong> was recorded in this browser. This checkout does not transfer money or provide disbursement proof.
      </p>

      <ReceiptPreview donation={donation} campaign={campaign} />

      {account ? (
        <XPRewardBanner amount={donation.amount} currentTotalXP={previousXP} />
      ) : (
        earnedXP > 0 && <p>Sign up with this email to collect XP on donations like this.</p>
      )}

      {donation.receiptId && (
        <p className="thank-you-screen__receipt-id">
          Receipt {donation.receiptId}
          {account ? ` · ${earnedXP} XP added to your account` : ""}
        </p>
      )}

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