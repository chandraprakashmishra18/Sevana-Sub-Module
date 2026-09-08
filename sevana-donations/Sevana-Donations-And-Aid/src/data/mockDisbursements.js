// Disbursement records, keyed by campaignId — shows how funds were actually spent
const mockDisbursements = {
  c1: [
    {
      id: "d1",
      date: "2026-07-02",
      amount: 5000,
      description: "First installment paid directly to Delhi Public School, Sector 21",
      photo: "https://picsum.photos/seed/disb-ananya-1/500/350",
      location: "Sector 21, Gurugram",
    },
    {
      id: "d2",
      date: "2026-07-20",
      amount: 4200,
      description: "Books, uniform, and school bag purchased and delivered",
      photo: "https://picsum.photos/seed/disb-ananya-2/500/350",
      location: "Sector 21, Gurugram",
    },
  ],
  c4: [
    {
      id: "d3",
      date: "2026-06-10",
      amount: 8000,
      description: "Motorized wheelchair purchased and delivered to Mr. Suresh's residence",
      photo: "https://picsum.photos/seed/disb-suresh-1/500/350",
      location: "Sector 14, Gurugram",
    },
  ],
};

export default mockDisbursements;