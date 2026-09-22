import "./FeedbackList.css";

function FeedbackList({ feedback }) {
  if (!feedback || feedback.length === 0) {
    return (
      <div className="feedback-list">
        <h2>Feedback</h2>
        <p className="feedback-list__empty">No feedback yet — be the first to share your experience.</p>
      </div>
    );
  }

  const averageRating = (
    feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length
  ).toFixed(1);

  return (
    <div className="feedback-list">
      <div className="feedback-list__header">
        <h2>Feedback ({feedback.length})</h2>
        <span className="feedback-list__average">⭐ {averageRating} average</span>
      </div>

      {feedback.map((item) => (
        <div className="feedback-item" key={item.id}>
          <div className="feedback-item__top">
            <p className="feedback-item__name">{item.name}</p>
            <span className="feedback-item__rating">{"⭐".repeat(item.rating)}</span>
          </div>
          <p className="feedback-item__comment">{item.comment}</p>
          <p className="feedback-item__date">{item.date}</p>
        </div>
      ))}
    </div>
  );
}

export default FeedbackList;