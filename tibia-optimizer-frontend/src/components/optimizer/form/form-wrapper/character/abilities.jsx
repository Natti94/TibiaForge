import { useState } from "react";
import { runesList } from "../../../../../index";
import { spellsList } from "../../../../../index";

function Abilities({ character }) {
  const VOCATION_MODIFIERS = {
    knight: { magic: 0.3 },
    paladin: { magic: 0.5 },
    sorcerer: { magic: 1.0 },
    druid: { magic: 1.0 },
    "": { magic: 0.1 },
  };

  const [mode, setMode] = useState("");
  const [selectedRune, setSelectedRune] = useState(null);
  const [selectedSpell, setSelectedSpell] = useState(null);

  const magicLevel = parseInt(character.magic) || 0;
  const MAGIC_FORMULA = magicLevel * 2 + 5;
  const vocation = character.vocation || "";
  const magicMod =
    (VOCATION_MODIFIERS[vocation] && VOCATION_MODIFIERS[vocation].magic) || 1;

  const forceCasing = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const calculateDamage = (item) => {
    if (!item) return { min: "", max: "" };
    if (item.minSubtract !== undefined || item.maxSubtract !== undefined) {
      const min = Math.floor(
        ((item.minFactor || 0) * MAGIC_FORMULA - (item.minSubtract || 0)) *
          magicMod
      );
      const max = Math.floor(
        ((item.maxFactor || 0) * MAGIC_FORMULA - (item.maxSubtract || 0)) *
          magicMod
      );
      return { min, max };
    }
    const min = Math.floor((item.minFactor || 0) * MAGIC_FORMULA * magicMod);
    const max = Math.floor((item.maxFactor || 0) * MAGIC_FORMULA * magicMod);
    return { min, max };
  };

  const runeDamage = calculateDamage(selectedRune);
  const spellDamage = calculateDamage(selectedSpell);

  return (
    <>
      <h2>Abilities</h2>
      {!character.vocation && (
        <div className="optimizer__select-vocation-message">
          <strong>🛈 Please select a vocation to view and edit this.</strong>
        </div>
      )}
      <div
        className={`optimizer__vocation-content${
          character.vocation ? " optimizer__vocation-content--show" : ""
        }`}
      >
        {character.vocation && (
          <>
            <div className="optimizer__abilities-header">
              <div>
                <h3>Vocational Ability Modifiers</h3>
                <p>
                  Your vocation is{" "}
                  <strong>{forceCasing(character.vocation)}.</strong>
                  <br />
                  <br />
                  Effective Damage:
                </p>
                <ul>
                  <li>
                    <span>
                      {forceCasing(vocation)}{" "}
                      {(VOCATION_MODIFIERS[vocation]?.magic ?? 1) * 100}%
                    </span>
                  </li>
                </ul>
              </div>
              <div className="optimizer__abilities-mode">
                <label className="optimizer__abilities-mode-label">
                  <span>Ability Type:</span>
                  <select
                    className="optimizer__abilities-mode-select"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="runes">Runes</option>
                    <option value="spells">Spells</option>
                  </select>
                </label>
              </div>
            </div>

            {mode === "runes" ? (
              <div className="optimizer__abilities-grid">
                <label>
                  Select Rune:
                  <br />
                  <select
                    value={selectedRune ? selectedRune.name : ""}
                    onChange={(e) => {
                      const rune = runesList.find(
                        (r) => r.name === e.target.value
                      );
                      setSelectedRune(rune || null);
                    }}
                  >
                    <option value="">Select rune</option>
                    {runesList.map((rune) => (
                      <option key={rune.name} value={rune.name}>
                        {rune.name}
                      </option>
                    ))}
                  </select>
                </label>
                {selectedRune && (
                  <div className="optimizer__ability-details">
                    <p>Type: {forceCasing(selectedRune.typeDamage)}</p>
                    <p>
                      Damage: {runeDamage.min} - {runeDamage.max}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="optimizer__abilities-grid">
                <label>
                  Select Spell:
                  <br />
                  <select
                    value={selectedSpell ? selectedSpell.name : ""}
                    onChange={(e) =>
                      setSelectedSpell(
                        spellsList.find((s) => s.name === e.target.value) ||
                          null
                      )
                    }
                  >
                    <option value="">Select Spell</option>
                    {spellsList
                      .filter(
                        (spell) =>
                          !spell.vocations ||
                          spell.vocations.includes(character.vocation)
                      )
                      .map((spell) => (
                        <option key={spell.name} value={spell.name}>
                          {spell.name}
                        </option>
                      ))}
                  </select>
                </label>
                {selectedSpell && (
                  <div className="optimizer__ability-details">
                    <div>
                      <strong>{selectedSpell.name}</strong>
                      <div>
                        Damage: {spellDamage.min} - {spellDamage.max}
                      </div>
                      <div>
                        Vocations:{" "}
                        {selectedSpell.vocations
                          ? forceCasing(selectedSpell.vocations.join(", "))
                          : "All"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Abilities;
