// Recent donors, keyed by campaignId
const mockDonors = {
  c1: [
    { name: "Rohit Sharma", amount: 1000, date: "2 days ago", xpEarned: 120 },
    { name: "Anonymous", amount: 500, date: "3 days ago", xpEarned: 50 },
    { name: "Priya Menon", amount: 2000, date: "5 days ago", xpEarned: 120 },
    { name: "Anonymous", amount: 250, date: "1 week ago", xpEarned: 10 },
  ],
  c2: [
    { name: "Vikram Singh", amount: 1500, date: "1 day ago", xpEarned: 120 },
    { name: "Anonymous", amount: 1000, date: "2 days ago", xpEarned: 120 },
    { name: "Sneha Kapoor", amount: 5000, date: "4 days ago", xpEarned: 700 },
  ],
  c3: [
    { name: "Anonymous", amount: 500, date: "3 days ago", xpEarned: 50 },
    { name: "Aditya Rao", amount: 1000, date: "1 week ago", xpEarned: 120 },
  ],
  c4: [
    { name: "Meera Joshi", amount: 3000, date: "3 weeks ago", xpEarned: 120 },
    { name: "Anonymous", amount: 5000, date: "3 weeks ago", xpEarned: 700 },
  ],
  c5: [
    { name: "Anil Deshmukh", amount: 2500, date: "1 day ago", xpEarned: 120 },
    { name: "Pooja Verma", amount: 5000, date: "2 days ago", xpEarned: 700 },
    { name: "Anonymous", amount: 1000, date: "3 days ago", xpEarned: 120 },
  ],
  c6: [
    { name: "Kavita Nair", amount: 3500, date: "12 hours ago", xpEarned: 120 },
    { name: "Ramesh Gupta", amount: 5000, date: "2 days ago", xpEarned: 700 },
    { name: "Anonymous", amount: 500, date: "4 days ago", xpEarned: 50 },
  ],
  c7: [
    { name: "Siddharth Sen", amount: 5000, date: "1 day ago", xpEarned: 700 },
    { name: "Dr. Sunita Roy", amount: 2000, date: "3 days ago", xpEarned: 120 },
  ],
};

export default mockDonors;
