import { Link } from "react-router-dom";
import { useDonation } from "../../context/useDonation";
import Button from "../common/Button";
import "./ThankYouScreen.css";

function ThankYouScreen() {
  const { donation } = useDonation();
  return <div className="thank-you-screen">
    <div className="thank-you-screen__icon">✓</div>
    <h2>Donation request recorded</h2>
    <p>Your donation request for <strong>₹{Number(donation.amount).toLocaleString("en-IN")}</strong> is <strong>{donation.donationStatus || "PENDING"}</strong>.</p>
    <p>No payment was processed. A payment provider must confirm the transaction before this donation can be marked successful or a receipt issued.</p>
    {donation.donationId && <p>Request ID: {donation.donationId}</p>}
    <div className="thank-you-screen__actions"><Link to="/campaigns"><Button variant="outline">Browse campaigns</Button></Link><Link to="/dashboard"><Button variant="primary">Open dashboard</Button></Link></div>
  </div>;
}

export default ThankYouScreen;
