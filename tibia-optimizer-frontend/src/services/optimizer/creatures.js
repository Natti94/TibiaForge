export async function fetchCreaturesDB(name = "") {
  if (!name) throw new Error("No creature name provided");
  const base = import.meta.env.VITE_API_TIBIA_DB_URL.replace(/\/$/, "");
  const url = `${base}/v4/creature/${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creature");

  const data = await res.json();
  const creature = data?.creature;
  if (!creature) throw new Error("No creature found");

  return {
    name: creature.name,
    image_url: creature.image_url,
    hitpoints: creature.hitpoints,
  };
}

export async function fetchCreaturesWikia(name = "") {
  if (!name) throw new Error("No creature name provided");
  const url = `/api/creatures/${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch creature");

  const data = await res.json();
  if (!data || typeof data !== "object") throw new Error("No creature found");

  return {
    mods: {
      ice: data.iceDmgMod,
      fire: data.fireDmgMod,
      earth: data.earthDmgMod,
      energy: data.energyDmgMod,
      holy: data.holyDmgMod,
      death: data.deathDmgMod,
      physical: data.physicalDmgMod,
    },
  };
}
