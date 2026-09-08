import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CampaignHeader from "../components/campaignDetail/CampaignHeader";
import DonationWidget from "../components/campaignDetail/DonationWidget";
import DonorList from "../components/campaignDetail/DonorList";
import DisbursementTrail from "../components/campaignDetail/DisbursementTrail";
import { getCampaignById } from "../services/campaignService";
import { getDonorsByCampaign, getDisbursementsByCampaign } from "../services/donationService";
import "./CampaignDetail.css";

function CampaignDetail() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donors, setDonors] = useState([]);
  const [disbursements, setDisbursements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCampaignById(id),
      getDonorsByCampaign(id),
      getDisbursementsByCampaign(id),
    ]).then(([campaignData, donorsData, disbursementsData]) => {
      if (isMounted) {
        setCampaign(campaignData);
        setDonors(donorsData);
        setDisbursements(disbursementsData);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container campaign-detail__not-found">
        <p>Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container campaign-detail__not-found">
        <h2>Campaign not found</h2>
        <Link to="/campaigns">← Back to all campaigns</Link>
      </div>
    );
  }

  return (
    <section className="campaign-detail">
      <div className="container campaign-detail__grid">
        <div className="campaign-detail__main">
          <CampaignHeader campaign={campaign} />
          <DisbursementTrail disbursements={disbursements} />
        </div>

        <div className="campaign-detail__sidebar">
          <DonationWidget campaign={campaign} />
          <DonorList donors={donors} />
        </div>
      </div>
    </section>
  );
}

export default CampaignDetail;