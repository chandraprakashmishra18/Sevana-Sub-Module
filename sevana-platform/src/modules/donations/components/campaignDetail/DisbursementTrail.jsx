import "./DisbursementTrail.css";

function DisbursementTrail({ disbursements }) {
  if (!disbursements || disbursements.length === 0) {
    return (
      <div className="disbursement-trail">
        <h2>Disbursement Trail</h2>
        <p className="disbursement-trail__empty">
          No funds have been disbursed yet — this campaign is still raising money.
          Disbursement updates will appear here once they are added.
        </p>
      </div>
    );
  }

  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="disbursement-trail">
      <div className="disbursement-trail__header">
        <h2>Disbursement Trail</h2>
        <span className="disbursement-trail__total">
          ₹{totalDisbursed.toLocaleString("en-IN")} disbursed & tracked
        </span>
      </div>

      <div className="disbursement-trail__timeline">
        {disbursements.map((item) => (
          <div className="disbursement-item" key={item.id}>
            <div className="disbursement-item__body">
              <p className="disbursement-item__date">
                {item.date ? new Date(item.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }) : "Date not provided"}
              </p>
              <p className="disbursement-item__desc">{item.description}</p>
              {item.amount != null && <p className="disbursement-item__amount">{item.currency === "INR" ? "₹" : `${item.currency} `}{Number(item.amount).toLocaleString("en-IN")}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisbursementTrail;
