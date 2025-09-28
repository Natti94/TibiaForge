export async function fetchWorlds() {
  const base = (
    import.meta.env.VITE_TIBIADATA_BASE || "https://api.tibiadata.com"
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/v4/worlds`);
  if (!res.ok) {
    throw new Error(`Failed to fetch worlds (${res.status})`);
  }
  const data = await res.json();
  const worlds = Array.isArray(data?.worlds?.regular_worlds)
    ? data.worlds.regular_worlds.map((w) => w.name).filter(Boolean)
    : [];
  return worlds;
}
