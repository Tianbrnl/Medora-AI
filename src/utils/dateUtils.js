/**
 * Formats a message timestamp into a clinician-friendly date and time.
 * - Today: "Today at 3:45 PM"
 * - Yesterday: "Yesterday at 9:15 AM"
 * - Same year: "Sep 25 at 2:30 PM"
 * - Different year: "Oct 12, 2025 at 1:15 PM"
 * Preserves mock or short strings like "10:30 AM", "Yesterday", "3 days ago".
 */
export function formatMessageTimestamp(timestamp) {
  if (!timestamp) return "";

  if (typeof timestamp === "string") {
    const trimmed = timestamp.trim();
    // Pre-formatted time (e.g. "10:30 AM")
    if (/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(trimmed)) {
      return trimmed;
    }
    // Relative mock strings
    if (/^(Yesterday|\d+\s+days?\s+ago|Just now)$/i.test(trimmed)) {
      return trimmed;
    }
  }

  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return String(timestamp);
  }

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeString = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) {
    return `Today at ${timeString}`;
  }

  if (isYesterday) {
    return `Yesterday at ${timeString}`;
  }

  const isCurrentYear = date.getFullYear() === now.getFullYear();
  const dateString = date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: isCurrentYear ? undefined : "numeric",
  });

  return `${dateString} at ${timeString}`;
}
