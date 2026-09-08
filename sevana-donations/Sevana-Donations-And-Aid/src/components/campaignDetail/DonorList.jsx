import "./DonorList.css";

function DonorList({ donors }) {
  if (!donors || donors.length === 0) {
    return (
      <div className="donor-list">
        <h3>Recent Donors</h3>
        <p className="donor-list__empty">Be the first to donate to this campaign.</p>
      </div>
    );
  }

  return (
    <div className="donor-list">
      <h3>Recent Donors ({donors.length})</h3>
      <ul>
        {donors.map((donor, index) => (
          <li key={index} className="donor-list__item">
            <div className="donor-list__avatar">{donor.name.charAt(0)}</div>
            <div className="donor-list__info">
              <p className="donor-list__name">{donor.name}</p>
              <p className="donor-list__date">{donor.date}</p>
            </div>
            <p className="donor-list__amount">₹{donor.amount.toLocaleString("en-IN")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DonorList;