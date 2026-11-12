// Formats a number as Indian Rupees with proper comma grouping (e.g. 150000 -> "₹1,50,000")
export function formatCurrency(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

// Formats large amounts in Lakhs for compact display (e.g. 250000 -> "₹2.5L")
export function formatCurrencyCompact(amount) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  return formatCurrency(amount);
}