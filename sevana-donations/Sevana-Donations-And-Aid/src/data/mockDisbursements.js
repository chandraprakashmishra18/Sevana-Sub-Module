// Disbursement records, keyed by campaignId — shows how funds were actually spent
const mockDisbursements = {
  c1: [
    {
      id: "d1",
      date: "2026-07-02",
      amount: 5000,
      description: "First installment paid directly to Delhi Public School, Sector 21",
      photo: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop",
      location: "Sector 21, Gurugram",
    },
    {
      id: "d2",
      date: "2026-07-20",
      amount: 4200,
      description: "Books, uniform, and school bag purchased and delivered to Ananya",
      photo: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=600&auto=format&fit=crop",
      location: "Sector 21, Gurugram",
    },
  ],
  c4: [
    {
      id: "d3",
      date: "2026-06-10",
      amount: 8000,
      description: "Motorized wheelchair purchased and delivered to Mr. Suresh's residence",
      photo: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop",
      location: "Sector 14, Gurugram",
    },
  ],
  c5: [
    {
      id: "d4",
      date: "2026-10-18",
      amount: 12000,
      description: "Fresh nutrition crates, fruit baskets, and school stationery delivered to Khushi Bal Grah Orphanage",
      photo: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop",
      location: "Sector 33, Gurugram",
    },
  ],
  c6: [
    {
      id: "d5",
      date: "2026-10-22",
      amount: 9500,
      description: "Geriatric medicine supplies and 4 orthopedic mobility walkers delivered to Shanti Niketan Old Age Home",
      photo: "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=600&auto=format&fit=crop",
      location: "DLF Phase 4, Gurugram",
    },
  ],
};

export default mockDisbursements;
