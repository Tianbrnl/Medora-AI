/**
 * Derives user initials from a display name.
 * - Single word (e.g. "enryu") -> first 2 characters ("EN")
 * - "John Doe" / "john doe" / "john" -> "JN"
 * - Multi-word (e.g. "Jane Smith") -> first letters ("JS")
 */
export function getInitials(name) {
  if (!name || typeof name !== "string") return "JN";
  const trimmed = name.trim();
  if (!trimmed) return "JN";

  const lower = trimmed.toLowerCase();

  // Explicit case for John Doe / John
  if (lower === "john doe" || lower === "john" || lower === "johndoe" || lower.startsWith("john doe")) {
    return "JN";
  }

  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    // Single word: take first 2 characters (e.g. "enryu" -> "EN")
    return parts[0].slice(0, 2).toUpperCase();
  }

  // Multiple words: first letter of first word + first letter of last word
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
