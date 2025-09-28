/**
 * Fetch highscores or worlds using TibiaData v4 API
 * @param {number|{world:string,category:string,vocation?:string,page?:number,limit?:number,fetchWorlds?:boolean}} args
 * If number: treated as limit (slice highscore list). If object: provide { world, category } and optional { vocation, page, limit } for highscores, or { fetchWorlds: true } for worlds.
 * @returns {Promise<{list: Array, page: number, totalPages: number|null, totalRecords: number|null, category: string, vocation: string, world: string, age?: number, information?: object} | string[]>}
 */
export async function fetchStatistics(args = {}) {
  const base = import.meta.env.VITE_API_TIBIA_BASE.replace(/\/$/, "");

  if (args.fetchWorlds) {
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

  let world,
    category,
    vocation = "all",
    page = 1,
    limit = 50;

  if (typeof args === "number") {
    limit = args;
  } else if (args && typeof args === "object") {
    ({ world, category, vocation = "all", page = 1, limit = 50 } = args);
  }

  if (!world || !category) {
    throw new Error(
      "fetchStatistics requires { world, category } for highscores"
    );
  }

  const url = `${base}/v4/highscores/${encodeURIComponent(
    world
  )}/${encodeURIComponent(category)}/${encodeURIComponent(
    vocation
  )}/${encodeURIComponent(page)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch statistics (${res.status})`);
  }
  const data = await res.json();
  const highscores = data?.highscores;

  const list = Array.isArray(highscores?.highscore_list)
    ? highscores.highscore_list.slice(0, limit)
    : [];

  return {
    list,
    page: highscores?.highscore_page?.current_page ?? page,
    totalPages: highscores?.highscore_page?.total_pages ?? null,
    totalRecords: highscores?.highscore_page?.total_records ?? null,
    category: highscores?.category ?? category,
    vocation: highscores?.vocation ?? vocation,
    world: highscores?.world ?? world,
    age: highscores?.highscore_age,
    information: data?.information,
  };
}
