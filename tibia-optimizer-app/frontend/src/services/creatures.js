export async function fetchCreatures(name = "") {
  if (!name) throw new Error("No creature name provided");
  const base = import.meta.env.VITE_API_TIBIA_DB_URL.replace(/\/$/, "");
  const url = `${base}/v4/creature/${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creature");

  const data = await res.json();
  const creature = data?.creature;
  if (!creature) throw new Error("No creature found");

  return {
    image_url: creature.image_url,
    name: creature.name,
    hitpoints: creature.hitpoints,
    immune: creature.immune,
    strong: creature.strong,
    weakness: creature.weakness,
  };
}
