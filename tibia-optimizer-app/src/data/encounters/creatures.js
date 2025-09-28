export async function fetchCreatures() {
  const base = import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "");
  const url = `${base}/v4/creatures`;
  if (!url) throw new Error("Creatures URL not configured");

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creatures");

  const data = await res.json();

  const creatures = data?.creatures;

  const list = Array.isArray(data?.creatures) ? data.creatures : [];
  return {
    list,
    creature: creatures?.name,
    type: creatures?.type,
    hitpoints: creatures?.hitpoints || null,
    abilities: Array.isArray(creatures?.abilities) ? creatures.abilities : null,
    vulnerabilities: Array.isArray(creatures?.vulnerabilities)
      ? creatures.vulnerabilities
      : null,
    armor: creatures?.armor || null,
    defense: creatures?.defense || null,
    experience: creatures?.experience || null,
    immunities: Array.isArray(creatures?.immunities)
      ? creatures.immunities
      : null,
  };
}
