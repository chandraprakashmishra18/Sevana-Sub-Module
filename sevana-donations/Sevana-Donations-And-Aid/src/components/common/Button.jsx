import "./Button.css";

// variant: "primary" | "accent" | "outline" | "ghost"
// size: "sm" | "md" | "lg"
function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? "btn--full" : ""}`}
    >
      {children}
    </button>
  );
}

export default Button;