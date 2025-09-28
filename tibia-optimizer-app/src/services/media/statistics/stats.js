/**
 * Fetch highscores using TibiaData v4 API syntax:
 * GET /v4/highscores/{world}/{category}/{vocation}/{page}
 * @param {number|{world:string,category:string,vocation?:string,page?:number,limit?:number}} args
 * If number: treated as limit (slice list). If object: provide { world, category } and optional { vocation, page, limit }.
 * @returns {Promise<{list: Array, page: number, totalPages: number|null, totalRecords: number|null, category: string, vocation: string, world: string, age?: number, information?: object}>}
 */

export async function fetchStatistics(args = {}) {
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
      "fetchStatistics requires { world, category } as per TibiaData API"
    );
  }

  const base = import.meta.env.VITE_API_TIBIA_DB.replace(/\/$/, "");
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
  const hs = data?.highscores;

  const list = Array.isArray(hs?.highscore_list)
    ? hs.highscore_list.slice(0, limit)
    : [];

  return {
    list,
    page: hs?.highscore_page?.current_page ?? page,
    totalPages: hs?.highscore_page?.total_pages ?? null,
    totalRecords: hs?.highscore_page?.total_records ?? null,
    category: hs?.category ?? category,
    vocation: hs?.vocation ?? vocation,
    world: hs?.world ?? world,
    age: hs?.highscore_age,
    information: data?.information,
  };
}
