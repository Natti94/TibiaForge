export async function fetchEvents() {
  const eventTypes = ["Bank_Robbery_Mini_World_Change"];

  const url = `api/pages/${eventTypes.join(",")}`;
  if (!url) throw new Error("Events URL not configured");
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events archive");

  const event = await res.json();
  if (!event || typeof event !== "object") throw new Error("No events found");

  return {
    name: event.name ?? "",
    reward: event.reward ?? "",
    time: event.timealloc ?? "",
    location: event.location ?? "",
    level: event.lvl ?? "",
    danger: event.dangers ?? "",
    start_date: event.start_date ?? event.startDate ?? "",
    excerpt: event.legend ?? "",
  };
}
