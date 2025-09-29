export async function fetchCreatures(name = "") {
  if (!name) throw new Error("No creature name provided");
  const base = import.meta.env.VITE_API_TIBIA_DB.replace(/\/$/, "");
  const url = `${base}/v4/creature/${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creature");

  const data = await res.json();
  const creature = data?.creature;
  if (!creature) throw new Error("No creature found");

  // Return all relevant properties as per API
  return {
    name: creature.name,
    race: creature.race,
    image_url: creature.image_url,
    description: creature.description,
    behaviour: creature.behaviour,
    hitpoints: creature.hitpoints,
    immune: creature.immune,
    strong: creature.strong,
    weak: creature.weak,
    // ...add any other properties you need
  };
}
