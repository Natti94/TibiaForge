import { useEffect, useState } from "react";
import { fetchStatistics, fetchWorlds } from "../../../../services";

function Statistics({
  world = "Antica",
  category = "experience",
  vocation = "all",
  page = 1,
  limit = 10,
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
    { value: "druids", label: "Druids" },
  ];

  // Load worlds
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const list = await fetchWorlds();
        if (isMounted && Array.isArray(list) && list.length) {
          setWorlds(["ALL", ...list]);
          if (!list.includes(selWorld) && selWorld !== "ALL") {
            setSelWorld("ALL");
          }
        }
      } catch (e) {
        // Keep default world if worlds fetch fails
        console.error(e);
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
        if (selWorld === "ALL") {
          // Aggregate across worlds: fetch first page for each world and combine
          const promises = worlds
            .filter((w) => w !== "ALL")
            .slice(0, 5)
            .map((w) =>
              fetchStatistics({
                world: w,
                category: selCategory,
                vocation: selVocation,
                page,
                limit: Math.ceil(limit / 2),
              })
            );
          const results = await Promise.allSettled(promises);
          const combined = results
            .filter((r) => r.status === "fulfilled")
            .flatMap((r) => r.value.list || []);
          // Sort by rank within each world, but for ALL we can sort by value/level desc if available
          combined.sort(
            (a, b) => (b.level ?? b.value ?? 0) - (a.level ?? a.value ?? 0)
          );
          setItems(combined.slice(0, limit));
          setMeta({ page: 1, totalPages: null, totalRecords: combined.length });
        } else {
          const data = await fetchStatistics({
            world: selWorld,
            category: selCategory,
            vocation: selVocation,
            page,
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
        console.error(err);
        setError("Failed to load statistics");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    getStatistics();
  }, [selWorld, selCategory, selVocation, page, limit, worlds]);

  const categoryLabel = (function () {
    const match = CATEGORY_OPTIONS.find((c) => c.value === selCategory);
    return match ? match.label : selCategory;
  })();
  const worldLabel = selWorld === "ALL" ? "All worlds" : selWorld;

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
      <h2 className="media__stats-title">
        Highscores: {categoryLabel} — {worldLabel}
      </h2>
      <ul className="media__stats-list">
        {items.map((item) => (
          <li className="media__stats-item" key={`${item.rank}-${item.name}`}>
            <span className="media__stats-rank">#{item.rank}</span>
            <span className="media__stats-name">{item.name}</span>
            {typeof item.level === "number" ? (
              <span className="media__stats-level"> — Level {item.level}</span>
            ) : null}

            {item.vocation ? (
              <span className="media__stats-vocation"> — {item.vocation}</span>
            ) : null}
          </li>
        ))}
      </ul>
      {meta.totalPages ? (
        <div className="media__stats-meta">
          Page {meta.page} of {meta.totalPages} ({meta.totalRecords ?? 0}{" "}
          records)
        </div>
      ) : null}
    </div>
  );
}

export default Statistics;
