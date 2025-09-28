import { useState } from "react";
import { runesList } from "../../../../../../../data/character/items/runes";

function DamageRunes({ character }) {
  const VOCATION_MODIFIERS = {
    knight: { magic: 0.3 },
    paladin: { magic: 0.5 },
    sorcerer: { magic: 1.0 },
    druid: { magic: 1.0 },
    "": { magic: 0.1 },
  };

  const [selectedRune, setSelectedRune] = useState(null);
  const magicLevel = parseInt(character.magic) || 0;
  const MAGIC_FORMULA = magicLevel * 2 + 5;
  const vocation = character.vocation || "";
  const magicMod =
    (VOCATION_MODIFIERS[vocation] && VOCATION_MODIFIERS[vocation].magic) || 1;

  let minDamage = "";
  let maxDamage = "";

  const forceCasing = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  };

  if (selectedRune) {
    if (
      selectedRune.minSubtract !== undefined ||
      selectedRune.maxSubtract !== undefined
    ) {
      minDamage = Math.floor(
        ((selectedRune.minFactor || 0) * MAGIC_FORMULA -
          (selectedRune.minSubtract || 0)) *
          magicMod
      );
      maxDamage = Math.floor(
        ((selectedRune.maxFactor || 0) * MAGIC_FORMULA -
          (selectedRune.maxSubtract || 0)) *
          magicMod
      );
    } else {
      minDamage = Math.floor(
        (selectedRune.minFactor || 0) * MAGIC_FORMULA * magicMod
      );
      maxDamage = Math.floor(
        (selectedRune.maxFactor || 0) * MAGIC_FORMULA * magicMod
      );
    }
  }

  return (
    <>
      <h2>Damage Runes</h2>
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
            <div>
              <h3>Vocational Rune Modifiers</h3>
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
            <label>
              Select Rune:
              <br />
              <select
                value={selectedRune ? selectedRune.name : ""}
                onChange={(e) => {
                  const rune = runesList.find((r) => r.name === e.target.value);
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
              <div>
                <p>Type: {forceCasing(selectedRune.typeDamage)}</p>
                <p>
                  Damage: {minDamage} - {maxDamage}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default DamageRunes;
