import mockFeedback from "../data/mockFeedback";

export async function getFeedbackByCamp(campId) {
  return Promise.resolve(mockFeedback[campId] || []);
}

// TEAMMATE: wire this to a real POST /camps/:id/feedback later.
export async function submitFeedback(campId, feedbackData) {
  console.log("Feedback submitted (mock) for", campId, feedbackData);
  return Promise.resolve({ success: true });
}