import { useState, useEffect } from "react";
import { fetchCreatures } from "../../../../../services";

function Creatures({ vocation }) {
  const [creature, setCreature] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const forceCasing = (str) =>
    str
      ? str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
      : "";

  useEffect(() => {
    async function loadCreature() {
      if (!searchTerm) {
        setCreature(null);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await fetchCreatures(searchTerm);
        setCreature(data);
      } catch (err) {
        setCreature(null);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (vocation) {
      loadCreature();
    } else {
      setCreature(null);
      setError(null);
    }
  }, [searchTerm, vocation]);

  return (
    <>
      {!vocation && (
        <div className="optimizer__select-vocation-message">
          <strong>🛈 Please select a vocation to view and edit this.</strong>
        </div>
      )}
      <div
        className={`optimizer__vocation-content$${
          vocation ? " optimizer__vocation-content--show" : ""
        }`}
      >
        {vocation && (
          <div className="optimizer__creature-panel">
            <div className="optimizer__creature-input-group">
              <label>
                <strong>Search Creature:</strong>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter creature name"
                  className="optimizer__creature-input"
                />
              </label>
            </div>
            {loading && (
              <p className="optimizer__creature-message">Loading...</p>
            )}
            {error && (
              <p className="optimizer__creature-message">Error: {error}</p>
            )}
            {!loading && !error && !creature && searchTerm && (
              <p className="optimizer__creature-message">No creature found</p>
            )}
            {!loading && !error && creature && (
              <div>
                <h3 className="optimizer__creature-name">
                  {forceCasing(creature.name)}
                </h3>
                <img
                  src={creature.image_url}
                  alt={creature.name}
                  className="optimizer__creature-image"
                />
                <div className="optimizer__creature-property-box">
                  <p className="optimizer__creature-property">
                    <strong>Race:</strong>{" "}
                    {forceCasing(creature.race || "Unknown")}
                  </p>
                  <p className="optimizer__creature-property">
                    <strong>Hitpoints:</strong>{" "}
                    {creature.hitpoints || "Unknown"}
                  </p>
                  <p className="optimizer__creature-property">
                    <strong>Description:</strong>{" "}
                    {creature.description || "None"}
                  </p>
                  {creature.immune && (
                    <p className="optimizer__creature-property">
                      <strong>Immune:</strong>{" "}
                      {creature.immune.join(", ") || "None"}
                    </p>
                  )}
                  {creature.strong && (
                    <p className="optimizer__creature-property">
                      <strong>Strong:</strong>{" "}
                      {creature.strong.join(", ") || "None"}
                    </p>
                  )}
                  {creature.weak && (
                    <p className="optimizer__creature-property">
                      <strong>Weak:</strong>{" "}
                      {creature.weakness.join(", ") || "None"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Creatures;
