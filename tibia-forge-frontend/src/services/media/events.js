export async function fetchEvents() {
  const eventTypes = ["Bank_Robbery_Mini_World_Change"];

  const url = `api/pages/${eventTypes.join(",")}`;
  if (!url) throw new Error("Events URL not configured");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events archive");

  const event = await res.json();
  if (!event || typeof event !== "object") throw new Error("No events found");

  const sanitizeText = (value) => {
    if (value == null) return "";
    let text = String(value);
    text = text.replace(/<[^>]*>/g, " ");
    text = text.replace(/\[\[([^|\]]+)(?:\|[^\]]+)?\]\]/g, "$1");
    text = text.replace(/'''|''/g, "");
    text = text.replace(/\s*,\s*/g, ", ");
    text = text.replace(/\s+/g, " ").trim();
    return text;
  };

  return {
    name: sanitizeText(event.name),
    reward: sanitizeText(event.reward),
    time: sanitizeText(event.timealloc),
    location: sanitizeText(event.location),
    level: sanitizeText(event.lvl),
    danger: sanitizeText(event.dangers),
    start_date: sanitizeText(event.start_date ?? event.startDate),
    excerpt: sanitizeText(event.legend),
  };
}
