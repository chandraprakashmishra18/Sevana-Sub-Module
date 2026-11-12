export const DONATION_PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000];

export const CAMPAIGN_CATEGORIES = [
  "All",
  "Student Sponsorship",
  "Family Aid",
  "In-Kind Giving",
  "Medical Aid",
];

export const CAMPAIGN_BENEFICIARIES = [
  "All",
  "Orphanage",
  "Old Age Home",
  "NGO",
  "General",
];

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
];

export const INDIAN_CITIES = [
  "Delhi NCR / Gurugram",
  "Delhi NCR / Noida",
  "Delhi NCR / New Delhi",
  "Mumbai, Maharashtra",
  "Bengaluru, Karnataka",
  "Hyderabad, Telangana",
  "Chennai, Tamil Nadu",
  "Kolkata, West Bengal",
  "Pune, Maharashtra",
  "Ahmedabad, Gujarat",
  "Jaipur, Rajasthan",
  "Lucknow, Uttar Pradesh",
  "Kochi, Kerala",
  "Chandigarh, Tricity",
  "Patna, Bihar",
  "Bhopal, Madhya Pradesh",
  "Guwahati, Assam",
  "Varanasi, Uttar Pradesh",
  "Indore, Madhya Pradesh",
  "Visakhapatnam, Andhra Pradesh",
];

export const ROLE_TAXONOMY = {
  donor: {
    category: "Philanthropy & Aid Support",
    label: "Donor / Philanthropist",
    icon: "💖",
    specialties: [
      "Individual Philanthropist",
      "Corporate CSR Partner",
      "Education Kit Sponsor",
      "Medical Diagnostic Van Patron",
      "Nutrition & Ration Supporter",
    ],
  },
  volunteer: {
    category: "Field Operations & Volunteering",
    label: "Volunteer / Community Worker",
    icon: "🤝",
    specialties: [
      "Camp Logistics & Setup",
      "Registration & Vitals Triage",
      "Elderly & Child Patient Escort",
      "Food & Nutritional Aid Distribution",
      "Crowd Management & Queue Control",
      "Community Awareness & Outreach",
      "First Aid Support",
    ],
  },
  doctor: {
    category: "Medical & Healthcare",
    label: "Doctor / Medical Specialist",
    icon: "🩺",
    specialties: [
      "General Physician / MBBS",
      "Pediatrician (Child Specialist)",
      "Ophthalmologist (Eye Specialist)",
      "Dentist / Oral Health",
      "Geriatric Specialist (Elderly Care)",
      "Cardiologist",
      "Gynecologist",
      "Orthopedic Specialist",
      "Staff Nurse / Paramedic",
      "Pharmacist",
    ],
  },
  teacher: {
    category: "Education & Literacy",
    label: "Teacher / Educational Lead",
    icon: "📚",
    specialties: [
      "Elementary & Foundational Literacy",
      "STEM & Science Educator",
      "Spoken English & Communication",
      "Digital Skills & Computer Literacy",
      "Mathematics & Problem Solving",
      "Career Mentor & Vocational Counselor",
      "Arts, Crafts & Value Education",
      "Special Education Specialist",
    ],
  },
  organizer: {
    category: "Organization & Leadership",
    label: "NGO / Institution Organizer",
    icon: "🏛️",
    specialties: [
      "NGO Director / Trustee",
      "Orphanage Superintendent",
      "Old Age Home Administrator",
      "College NSS / NCC Officer",
      "Hospital Outreach / CSR Lead",
      "Resident Welfare (RWA) President",
    ],
  },
  citizen: {
    category: "Community Member",
    label: "General Citizen / Supporter",
    icon: "👥",
    specialties: [
      "Community Supporter",
      "Youth Volunteer",
      "Parent / Well-wisher",
      "Senior Citizen Advocate",
    ],
  },
};
