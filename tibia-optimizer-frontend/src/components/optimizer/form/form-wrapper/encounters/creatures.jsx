import { useState, useEffect, useMemo } from "react";
import {
  fetchCreaturesDB,
  fetchCreaturesWikia,
} from "../../../../../services/optimizer/creatures";

function Creatures({ vocation }) {
  const [DBCreature, setDBCreature] = useState(null);
  const [wikiaCreature, setWikiaCreature] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDB, setLoadingDB] = useState(false);
  const [loadingWikia, setLoadingWikia] = useState(false);
  const [errorDB, setErrorDB] = useState(null);
  const [errorWikia, setErrorWikia] = useState(null);

  const forceCasing = (str) =>
    str
      ? str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())
      : "";

  useEffect(() => {
    async function loadCreatureDB() {
      if (!searchTerm) {
        setDBCreature(null);
        setErrorDB(null);
        return;
      }
      setLoadingDB(true);
      setErrorDB(null);
      try {
        const data = await fetchCreaturesDB(searchTerm);
        setDBCreature(data);
      } catch (err) {
        setDBCreature(null);
        setErrorDB(err.message);
      } finally {
        setLoadingDB(false);
      }
    }
    if (vocation) {
      loadCreatureDB();
    } else {
      setDBCreature(null);
      setErrorDB(null);
    }
  }, [searchTerm, vocation]);

  useEffect(() => {
    async function loadCreatureWikia() {
      if (!searchTerm) {
        setWikiaCreature(null);
        setErrorWikia(null);
        return;
      }
      setLoadingWikia(true);
      setErrorWikia(null);
      try {
        const wikiaData = await fetchCreaturesWikia(searchTerm);
        setWikiaCreature(wikiaData);
      } catch (err) {
        setWikiaCreature(null);
        setErrorWikia(err.message);
      } finally {
        setLoadingWikia(false);
      }
    }
    if (vocation) {
      loadCreatureWikia();
    } else {
      setWikiaCreature(null);
      setErrorWikia(null);
    }
  }, [searchTerm, vocation]);

  const creature = useMemo(() => {
    if (!DBCreature && !wikiaCreature) return null;
    if (DBCreature) {
      return {
        ...DBCreature,
        mods: wikiaCreature?.mods,
      };
    }
    return {
      mods: wikiaCreature?.mods,
    };
  }, [DBCreature, wikiaCreature, searchTerm]);

  const loading = loadingDB || loadingWikia;
  const error = errorDB && errorWikia ? `${errorDB} | ${errorWikia}` : null;

  return (
    <>
      {!vocation && (
        <div className="optimizer__select-vocation-message">
          <strong>🛈 Please select a vocation to view and edit this.</strong>
        </div>
      )}
      <div
        className={`optimizer__vocation-content${
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
                    <strong>Hitpoints:</strong>{" "}
                    {creature.hitpoints || "Unknown"}
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
                  <p className="optimizer__creature-property">
                    <strong>Mods:</strong>{" "}
                    {creature.mods && Object.keys(creature.mods).length > 0
                      ? Object.entries(creature.mods)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")
                      : "None"}
                  </p>
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
