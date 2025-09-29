import { weaponsList } from "../../../../../../data/character/items/weapons";

function Weapons({ vocation, weapon, setWeapon }) {
  const placeholderWeapons = {
    sword: ["Sword Test"],
    axe: ["Axe Test"],
    club: ["Club Test"],
    bow: ["Bow Test"],
    crossbow: ["Crossbow Test"],
    wand: ["Wand Test"],
    rod: ["Rod Test"],
    arrow: ["Arrow Test"],
    bolt: ["Bolt Test"],
  };

  const forceCasing = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const getAllOptions = (type) => {
    const t = (type || "").toLowerCase();
    const data = Array.isArray(weaponsList) ? weaponsList : [];
    const s = (v) => (v || "").toLowerCase();
    const placeholders = placeholderWeapons[t] || [];

    let apiNames = [];

    if (t === "sword" || t === "axe" || t === "club") {
      apiNames = data
        .filter(
          (item) =>
            item &&
            item.name &&
            ((item.skills &&
              Object.prototype.hasOwnProperty.call(item.skills, t)) ||
              s(item.name).includes(t))
        )
        .map((item) => item.name);
    } else if (t === "wand") {
      apiNames = data
        .filter((item) => item && item.name && s(item.name).includes("wand"))
        .map((item) => item.name);
    } else if (t === "rod") {
      apiNames = data
        .filter((item) => item && item.name && s(item.name).includes("rod"))
        .map((item) => item.name);
    } else if (t === "arrow" || t === "bolt") {
      const isArrow = t === "arrow";
      apiNames = data
        .filter((item) => item && s(item.type) === "ammunition" && item.name)
        .filter((item) =>
          isArrow
            ? s(item.name).includes("arrow")
            : s(item.name).includes("bolt")
        )
        .map((item) => item.name);
    } else {
      apiNames = data
        .filter((item) => item && item.type && s(item.type) === t && item.name)
        .map((item) => item.name);
    }

    const uniqueApi = Array.from(new Set(apiNames));
    return [
      ...placeholders,
      ...uniqueApi.filter((n) => !placeholders.includes(n)),
    ];
  };

  const selectedWeaponObj = weaponsList.find(
    (item) => item.name === weapon.weapon
  );
  const selectedName = (weapon.weapon || "").toLowerCase();
  const isCrossbow =
    (selectedWeaponObj &&
      selectedWeaponObj.name &&
      selectedWeaponObj.name.toLowerCase().includes("crossbow")) ||
    selectedName.includes("crossbow");
  const isBow =
    ((selectedWeaponObj &&
      selectedWeaponObj.name &&
      selectedWeaponObj.name.toLowerCase().includes("bow")) ||
      selectedName.includes("bow")) &&
    !isCrossbow;

  const renderWeaponProps = () => {
    const obj = selectedWeaponObj;
    if (!obj) return null;
    return (
      <ul>
        {obj.attack !== undefined && obj.attack !== null && (
          <li>Attack: {obj.attack}</li>
        )}
        {obj.damage !== undefined && obj.damage !== null && (
          <li>
            Damage:{" "}
            {typeof obj.damage === "object"
              ? `${obj.damage.min} - ${obj.damage.max}`
              : obj.damage}
          </li>
        )}
        {obj.typeDamage && <li>Type: {forceCasing(obj.typeDamage)}</li>}
        {obj.resistanceAll !== undefined && obj.resistanceAll !== 0 && (
          <li>All Resistance: {obj.resistanceAll}%</li>
        )}
        {obj.resistance &&
          Object.entries(obj.resistance).map(([element, value]) => (
            <li key={element}>
              {forceCasing(element)}: {value}%
            </li>
          ))}
        {obj.skills &&
          Object.entries(obj.skills).map(([skill, value]) => (
            <li key={skill}>
              {forceCasing(skill)}: {value}
            </li>
          ))}
      </ul>
    );
  };

  return (
    <div>
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
          <>
            <label>
              <h4>🛈 Your vocation has already been selected.</h4>
              <h5>
                This now displays the weapon options available for your
                vocation.
              </h5>
              <select value={vocation} disabled>
                <option value="">Select vocation</option>
                <option value="knight">Knight</option>
                <option value="paladin">Paladin</option>
                <option value="sorcerer">Sorcerer</option>
                <option value="druid">Druid</option>
              </select>
            </label>
            <br />
            <br />
            {vocation === "knight" && (
              <label>
                Weapon:
                <br />
                <select
                  value={weapon.weapon}
                  onChange={(e) =>
                    setWeapon({ ...weapon, weapon: e.target.value })
                  }
                >
                  <option value="">Select Weapon</option>
                  {["sword", "axe", "club"].flatMap((type) =>
                    getAllOptions(type).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </label>
            )}
            {vocation === "paladin" && (
              <>
                <label>
                  Weapon:
                  <br />
                  <select
                    value={weapon.weapon}
                    onChange={(e) =>
                      setWeapon({ ...weapon, weapon: e.target.value })
                    }
                  >
                    <option value="">Select Weapon</option>
                    {["bow", "crossbow"].flatMap((type) =>
                      getAllOptions(type).map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))
                    )}
                  </select>
                </label>
                {isBow && (
                  <label>
                    Arrow:
                    <br />
                    <select
                      value={weapon.ammunition}
                      onChange={(e) =>
                        setWeapon({ ...weapon, ammunition: e.target.value })
                      }
                    >
                      <option value="">Select arrow</option>
                      {getAllOptions("arrow").map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
                {isCrossbow && (
                  <label>
                    Bolt:
                    <br />
                    <select
                      value={weapon.ammunition}
                      onChange={(e) =>
                        setWeapon({ ...weapon, ammunition: e.target.value })
                      }
                    >
                      <option value="">Select bolt</option>
                      {getAllOptions("bolt").map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
              </>
            )}
            {vocation === "sorcerer" && (
              <label>
                Weapon:
                <br />
                <select
                  value={weapon.weapon}
                  onChange={(e) =>
                    setWeapon({ ...weapon, weapon: e.target.value })
                  }
                >
                  <option value="">Select Weapon</option>
                  {["wand"].flatMap((type) =>
                    getAllOptions(type).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </label>
            )}
            {vocation === "druid" && (
              <label>
                Weapon:
                <br />
                <select
                  value={weapon.weapon}
                  onChange={(e) =>
                    setWeapon({ ...weapon, weapon: e.target.value })
                  }
                >
                  <option value="">Select weapon</option>
                  {["rod"].flatMap((type) =>
                    getAllOptions(type).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))
                  )}
                </select>
              </label>
            )}
            {renderWeaponProps()}
          </>
        )}
      </div>
    </div>
  );
}

export default Weapons;
