const mockInvitations = [
  {
    id: "inv1",
    campId: "camp1",
    campTitle: "Free Eye Checkup & Medicine Camp",
    fromUserId: "organizer1",
    fromName: "Roshni Foundation",
    toEmail: "volunteer@example.com",
    status: "pending",
    message:
      "We'd love to have you join us as a worker at our upcoming eye camp! Your skills in patient coordination would be invaluable.",
    createdAt: "2026-09-20",
    role: "worker",
  },
  {
    id: "inv2",
    campId: "camp2",
    campTitle: "Spoken English & Digital Literacy Workshop",
    fromUserId: "organizer2",
    fromName: "NSS Unit, K.R. Mangalam University",
    toEmail: "volunteer@example.com",
    status: "accepted",
    message:
      "Hi! We are looking for volunteer teachers for our digital literacy workshop. Hope to see you there!",
    createdAt: "2026-09-25",
    role: "worker",
  },
  {
    id: "inv3",
    campId: "camp3",
    campTitle: "Street Dog Vaccination & Health Camp",
    fromUserId: "organizer3",
    fromName: "PawCare Trust",
    toEmail: "colleague@example.com",
    status: "declined",
    message: "We think you'd be a great fit as an attendee observer for this camp.",
    createdAt: "2026-09-22",
    role: "attendee",
  },
  {
    id: "inv4",
    campId: "camp5",
    campTitle: "Orphanage Joy Day — Arts & Crafts",
    fromUserId: "organizer5",
    fromName: "Khushi Foundation",
    toEmail: "friend@example.com",
    status: "pending",
    message:
      "Would you like to co-lead this camp with us? Your organizational experience is exactly what we need.",
    createdAt: "2026-10-01",
    role: "organizer",
  },
  {
    id: "inv5",
    campId: "camp6",
    campTitle: "Old Age Home Health Check Drive",
    fromUserId: "currentUser",
    fromName: "You",
    toEmail: "dr.sharma@example.com",
    status: "pending",
    message:
      "Hey Dr. Sharma, would you be able to join us as a worker volunteer for this health check drive at the old age home?",
    createdAt: "2026-10-05",
    role: "worker",
  },
];

export default mockInvitations;
