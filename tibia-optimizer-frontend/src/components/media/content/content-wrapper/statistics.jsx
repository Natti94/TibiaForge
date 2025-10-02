import { useEffect, useState } from "react";
import { fetchStatistics } from "../../../..";

function Statistics({
  world = "antica",
  category = "experience",
  vocation,
  page = 1,
  limit = 50,
}) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState({
    page,
    totalPages: null,
    totalRecords: null,
  });
  const [worlds, setWorlds] = useState([world]);
  const [selWorld, setSelWorld] = useState(world);
  const [selCategory, setSelCategory] = useState(category);
  const [selVocation, setSelVocation] = useState(vocation);

  const isProd = import.meta.env.PROD;

  const assets = {
    statistics_banner: isProd
      ? `/api/getAsset?asset=statistics_banner`
      : import.meta.env.VITE_CLOUDINARY_STATISTICS_BANNER,
  };

  const CATEGORY_OPTIONS = [
    { value: "experience", label: "Experience" },
    { value: "magic", label: "Magic Level" },
    { value: "shielding", label: "Shielding" },
    { value: "distance", label: "Distance" },
    { value: "sword", label: "Sword" },
    { value: "axe", label: "Axe" },
    { value: "club", label: "Club" },
    { value: "fist", label: "Fist" },
    { value: "fishing", label: "Fishing" },
  ];

  const VOCATION_OPTIONS = [
    { value: "all", label: "All Vocations" },
    { value: "knights", label: "Knights" },
    { value: "paladins", label: "Paladins" },
    { value: "sorcerers", label: "Sorcerers" },
    { value: "druids  ", label: "Druids" },
  ];

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const worldList = await fetchStatistics({ fetchWorlds: true });
        if (isMounted && Array.isArray(worldList) && worldList.length) {
          setWorlds(["All", ...worldList]);
          if (!worldList.includes(selWorld) && selWorld !== "All") {
            setSelWorld("All");
          }
        }
      } catch (e) {
        console.error("Failed to fetch worlds:", e);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const getStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        if (selWorld === "All") {
          const promises = worlds
            .filter((w) => w !== "All")
            .slice(0, 5)
            .map((w) =>
              fetchStatistics({
                world: w,
                category: selCategory,
                vocation: selVocation,
                page: meta.page,
                limit: Math.ceil(limit / 2),
              })
            );
          const results = await Promise.allSettled(promises);
          const combined = results
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value.list || []);
          combined.sort(
            (a, b) => (b.level ?? b.value ?? 0) - (a.level ?? a.value ?? 0)
          );
          setItems(combined.slice(0, limit));
          setMeta((m) => ({
            ...m,
            page: Number(meta.page),
            totalPages: 20,
            totalRecords: combined.length,
          }));
        } else {
          const data = await fetchStatistics({
            world: selWorld,
            category: selCategory,
            vocation: selVocation,
            page: meta.page,
            limit,
          });
          setItems(data.list || []);
          setMeta({
            page: data.page,
            totalPages: data.totalPages,
            totalRecords: data.totalRecords,
          });
        }
      } catch (err) {
        console.error("Failed to load statistics:", err);
        setError("Failed to load statistics");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    getStatistics();
  }, [selWorld, selCategory, selVocation, meta.page, limit, worlds]);

  const categoryLabel =
    CATEGORY_OPTIONS.find((c) => c.value === selCategory)?.label ?? selCategory;
  const worldLabel = selWorld === "All" ? "All worlds" : selWorld;

  return (
    <div className="media__stats">
      <img
        className="media__stats-banner"
        src={assets.statistics_banner}
        alt="Statistics Banner"
      />
      <div className="media__stats-controls">
        <select
          className="media__stats-select"
          aria-label="World"
          value={selWorld}
          onChange={(e) => setSelWorld(e.target.value)}
        >
          {worlds.map((w) => (
            <option key={w} value={w}>
              {w}
            </option>
          ))}
        </select>
        <select
          className="media__stats-select"
          aria-label="Category"
          value={selCategory}
          onChange={(e) => setSelCategory(e.target.value)}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <select
          className="media__stats-select"
          aria-label="Vocation"
          value={selVocation}
          onChange={(e) => setSelVocation(e.target.value)}
        >
          {VOCATION_OPTIONS.map((v) => (
            <option key={v.value} value={v.value}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="media__stats-error">{error}</div>}
      {loading ? (
        <div className="media__stats-loading">Loading...</div>
      ) : (
        <ul className="media__stats-list">
          {items.map((item) => (
            <li className="media__stats-item" key={`${item.rank}-${item.name}`}>
              <span className="media__stats-rank">#{item.rank}</span>
              <span className="media__stats-name">{item.name}</span>
              {typeof item.level === "number" ? (
                <span className="media__stats-level">
                  {" "}
                  — Level {item.level}
                </span>
              ) : null}
              {item.vocation ? (
                <span className="media__stats-vocation">
                  {" "}
                  — {item.vocation}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {meta.totalPages ? (
        <select
          className="media__stats-select-page"
          aria-label="Page"
          value={meta.page}
          onChange={(e) =>
            setMeta((m) => ({ ...m, page: Number(e.target.value) }))
          }
        >
          {Array.from({ length: meta.totalPages }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              Page: {i + 1}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  );
}

export default Statistics;
