/**
 * Formats a message timestamp into a clinician-friendly date and time.
 * - Today: "Today at 3:45 PM"
 * - Yesterday: "Yesterday at 9:15 AM"
 * - Same year: "Sep 25 at 2:30 PM"
 * - Different year: "Oct 12, 2025 at 1:15 PM"
 * Preserves pre-formatted short strings like "10:30 AM", "Yesterday", "3 days ago".
 */
export function formatMessageTimestamp(timestamp) {
  if (!timestamp) return "";

  if (typeof timestamp === "string") {
    const trimmed = timestamp.trim();
    // Pre-formatted time (e.g. "10:30 AM")
    if (/^\d{1,2}:\d{2}\s?(AM|PM|am|pm)$/i.test(trimmed)) {
      return trimmed;
    }
    // Relative short strings
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

/**
 * Formats a duration in seconds into human-readable cooldown (e.g. "5h 42m", "15m", "45s").
 */
export function formatCooldown(seconds) {
  if (!seconds || seconds <= 0) return "soon";

  const totalSecs = Math.max(1, Math.round(seconds));
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;

  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  if (minutes > 0) {
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`;
  }
  return `${secs}s`;
}
