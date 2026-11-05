import React from "react";

/**
 * Universal text highlighter for search queries.
 * Highlights matching query terms inside strings with a high-visibility badge.
 */
export function highlightText(text, query) {
  if (text === null || text === undefined || text === "") return "";
  if (!query || typeof query !== "string" || !query.trim()) return text;

  const textStr = String(text);
  const cleanQ = query.trim();

  const terms = cleanQ
    .split(/\s+/)
    .filter(Boolean)
    .map((t) => t.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"));

  if (terms.length === 0) return textStr;

  const regex = new RegExp(`(${terms.join("|")})`, "gi");
  const parts = textStr.split(regex);
  const matchPattern = new RegExp(`^(${terms.join("|")})$`, "i");

  return parts.map((part, index) =>
    matchPattern.test(part) ? (
      <mark key={index} className="st-highlight">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default highlightText;

