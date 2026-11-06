/**
 * Format a number as PKR (Pakistani Rupees).
 * All store prices are placeholders — confirm with the owner before launch.
 */
export function formatPrice(amount: number): string {
  return `Rs ${new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(amount)}`;
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateStr));
}

/**
 * Calculate discount percentage.
 */
export function discountPercent(price: number, compareAt: number): number {
  return Math.round((1 - price / compareAt) * 100);
}

/**
 * Truncate text with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
