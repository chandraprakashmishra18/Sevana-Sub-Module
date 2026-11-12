import "./ReceiptPreview.css";

function ReceiptPreview({ donation, campaign }) {
  const formattedDate = donation.receiptDate
    ? new Date(donation.receiptDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="receipt-preview">
      <div className="receipt-preview__header">
        <span className="receipt-preview__logo">Sevana</span>
        <span className="receipt-preview__tag">80G Donation Receipt</span>
      </div>

      <div className="receipt-preview__row">
        <span>Receipt No.</span>
        <strong>{donation.receiptId}</strong>
      </div>
      <div className="receipt-preview__row">
        <span>Date</span>
        <strong>{formattedDate}</strong>
      </div>
      <div className="receipt-preview__row">
        <span>Donor Name</span>
        <strong>{donation.anonymous ? "Anonymous" : donation.donorName}</strong>
      </div>
      <div className="receipt-preview__row">
        <span>Campaign</span>
        <strong>{campaign ? campaign.title : "General Fund"}</strong>
      </div>
      {donation.panNumber && (
        <div className="receipt-preview__row">
          <span>PAN</span>
          <strong>{donation.panNumber}</strong>
        </div>
      )}
      <div className="receipt-preview__row receipt-preview__amount">
        <span>Amount Donated</span>
        <strong>₹{donation.amount.toLocaleString("en-IN")}</strong>
      </div>

      <p className="receipt-preview__footer">
        This donation is eligible for tax exemption under Section 80G of the
        Income Tax Act. A copy has been sent to your registered email.
      </p>
    </div>
  );
}

export default ReceiptPreview;