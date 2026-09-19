import "./Badge.css";

// tone: "verified" | "urgent" | "info" | "medical" | "educational" | "neutral"
function Badge({ children, tone = "neutral" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export default Badge;