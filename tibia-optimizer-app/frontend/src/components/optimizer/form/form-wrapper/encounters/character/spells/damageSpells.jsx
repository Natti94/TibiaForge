import { useState } from "react";
import { spellsList } from "../../../../../../../data/character/spells";

function DamageSpells({ character }) {
  const VOCATION_MODIFIERS = {
    knight: { magic: 0.3 },
    paladin: { magic: 0.5 },
    sorcerer: { magic: 1.0 },
    druid: { magic: 1.0 },
    "": { magic: 0.1 },
  };

  const [selectedSpell, setSelectedSpell] = useState(null);
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

  if (selectedSpell) {
    if (
      selectedSpell.minSubtract !== undefined ||
      selectedSpell.maxSubtract !== undefined
    ) {
      minDamage = Math.floor(
        ((selectedSpell.minFactor || 0) * MAGIC_FORMULA -
          (selectedSpell.minSubtract || 0)) *
          magicMod
      );
      maxDamage = Math.floor(
        ((selectedSpell.maxFactor || 0) * MAGIC_FORMULA -
          (selectedSpell.maxSubtract || 0)) *
          magicMod
      );
    } else {
      minDamage = Math.floor(
        (selectedSpell.minFactor || 0) * MAGIC_FORMULA * magicMod
      );
      maxDamage = Math.floor(
        (selectedSpell.maxFactor || 0) * MAGIC_FORMULA * magicMod
      );
    }
  }

  return (
    <>
      <h2>Damage Spells</h2>
      {!character.vocation && (
        <div className="optimizer__select-vocation-message">
          <strong>🛈 Please select a vocation to view and edit this.</strong>
        </div>
      )}
      <div
        className={`optimizer__vocation-content${
          character.vocation ? " optimizer__vocation-content--show" : ""
        }`}
      ></div>
      {character.vocation && (
        <>
          <div>
            <h3>Vocational Spell Modifiers</h3>
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
            Select Spell:
            <br />
            <select
              value={selectedSpell ? selectedSpell.name : ""}
              onChange={(e) =>
                setSelectedSpell(
                  spellsList.find((spell) => spell.name === e.target.value)
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
            <div className="spell-details">
              <div>
                <strong>{selectedSpell.name}</strong>
                <div>
                  Damage: {minDamage} - {maxDamage}
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
        </>
      )}
    </>
  );
}
export default DamageSpells;
