export function removeHtmlTags(text) {
  return String(text || "").replace(/<[^>]*>/g, "");
}

export function normalizeText(text) {
  return String(text || "").trim().replace(/\s+/g, " ");
}

export function makeBusinessKey(item) {
  return [
    removeHtmlTags(item.title || item.name),
    item.address || "",
    item.roadAddress || ""
  ].join("|");
}
