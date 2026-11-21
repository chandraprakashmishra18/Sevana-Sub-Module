import "./ReceiptPreview.css";

export default function ReceiptPreview({ donation, campaign }) {
  return <div className="receipt-preview"><div className="receipt-preview__header"><span className="receipt-preview__logo">Sevana</span><span className="receipt-preview__tag">Pending donation intent</span></div><div className="receipt-preview__row"><span>Intent reference</span><strong>{donation.donationIntentId || "Not recorded"}</strong></div><div className="receipt-preview__row"><span>Campaign</span><strong>{campaign?.title || "General Fund"}</strong></div><div className="receipt-preview__row receipt-preview__amount"><span>Requested amount</span><strong>₹{Number(donation.amount || 0).toLocaleString("en-IN")}</strong></div><p className="receipt-preview__footer">This is not a payment receipt or tax document. Payment is pending and no funds have been transferred.</p></div>;
}
