import { useState, useEffect } from "react";
import { useMemo, useRef } from "react";
import { equipmentsList } from "../../../data/character/items/equipments";
import { weaponsList } from "../../../data/character/items/weapons";
import Skills from "./form-wrapper/character/skills";
import Equipments from "./form-wrapper/character/items/equipments";
import Weapons from "./form-wrapper/character/items/weapons";
import Abilities from "./form-wrapper/character/abilities";
import Creatures from "./form-wrapper/encounters/creatures";

function CircleMenu({
  items,
  onSelect,
  onClose,
  vocation,
  onVocationChange,
  interactive = true,
}) {
  const ref = useRef(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [size, setSize] = useState(0);

  const sliceDeg = 360 / items.length;
  const gradient = useMemo(() => {
    const sep = 1.2;
    const stops = items
      .map((it, i) => {
        const start = i * sliceDeg;
        const end = (i + 1) * sliceDeg;
        const sliceStart = start;
        const sliceEnd = end - sep;
        const separatorStart = end - sep;
        const separatorEnd = end;
        const fill = it.enabled
          ? "rgba(0, 255, 255, 0.08)"
          : "rgba(180, 180, 180, 0.08)";
        const sepColor = "rgba(255, 140, 0, 0.35)";
        return [
          `${fill} ${sliceStart}deg`,
          `${fill} ${sliceEnd}deg`,
          `${sepColor} ${separatorStart}deg`,
          `${sepColor} ${separatorEnd}deg`,
        ].join(", ");
      })
      .join(", ");
    return `conic-gradient(${stops})`;
  }, [items.length, sliceDeg]);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      setSize(ref.current.getBoundingClientRect().width);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const onPointerMove = (e) => {
    if (!interactive) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const deg = (angle + 360 + 90) % 360;
    const index = Math.floor(deg / sliceDeg);
    if (items[index]?.enabled) setHoverIndex(index);
    else setHoverIndex(null);
  };

  const onPointerLeave = () => setHoverIndex(null);

  const onPointerUp = (e) => {
    if (!interactive) return;
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    const innerRadius = Math.min(rect.width, rect.height) * 0.18; // avoid center clicks
    if (r < innerRadius) return; // ignore clicks in the center hub

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI; // -180..180
    const deg = (angle + 360 + 90) % 360; // rotate so 0deg is up
    const index = Math.floor(deg / sliceDeg);
    const item = items[index];
    if (item && item.enabled) onSelect(item.key);
  };

  return (
    <div
      className="optimizer__circle"
      ref={ref}
      style={{ backgroundImage: gradient }}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      onMouseUp={onPointerUp}
      role="menu"
      aria-label="Choose section"
    >
      <div className="optimizer__circle-center">
        <div className="optimizer__circle-center-content">
          <label className="optimizer__circle-vocation-label">Vocation</label>
          <select
            className="optimizer__circle-vocation"
            value={vocation || ""}
            onChange={(e) =>
              onVocationChange && onVocationChange(e.target.value)
            }
          >
            <option value="">Select Vocation</option>
            <option value="knight">Knight</option>
            <option value="paladin">Paladin</option>
            <option value="sorcerer">Sorcerer</option>
            <option value="druid">Druid</option>
          </select>
        </div>
      </div>
      <div className="optimizer__circle-labels">
        {items.map((it, i) => {
          const angleDeg = i * sliceDeg + sliceDeg / 2;
          const rad = ((angleDeg - 90) * Math.PI) / 180;
          const r = size * 0.36;
          const xPct = 50 + ((r * Math.cos(rad)) / (size || 1)) * 100;
          const yPct = 50 + ((r * Math.sin(rad)) / (size || 1)) * 100;
          return (
            <div
              key={it.key}
              className={`optimizer__circle-label${
                it.enabled ? "" : " optimizer__circle-label--disabled"
              }${hoverIndex === i ? " optimizer__circle-label--hover" : ""}${
                it.done ? " optimizer__circle-label--done" : ""
              }`}
              style={{ left: `${xPct}%`, top: `${yPct}%` }}
            >
              <span className="optimizer__circle-num">{i + 1}</span>
              <span>{it.label}</span>
              {it.done ? (
                <span className="optimizer__circle-done">✓</span>
              ) : null}
            </div>
          );
        })}
      </div>
      {hoverIndex != null && (
        <div
          className="optimizer__circle-highlight"
          style={{ transform: `rotate(${hoverIndex * sliceDeg}deg)` }}
        />
      )}
    </div>
  );
}

function Form() {
  const [main, setMain] = useState({
    vocation: "",
    level: "",
    magic: "",
  });

  const [secondary, setSecondary] = useState({
    sword: "",
    axe: "",
    club: "",
    distance: "",
    shield: "",
  });

  const [equipment, setEquipment] = useState({
    helmet: "",
    armor: "",
    leg: "",
    boot: "",
    amulet: "",
    ring: "",
    trinket: "",
    shield: "",
    quiver: "",
    spellbook: "",
  });

  const [weapon, setWeapon] = useState({
    weapon: "",
    ammunition: "",
  });

  const [intro, setIntro] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeWindow, setActiveWindow] = useState(null); // skills|equipments|weapons|abilities|creatures
  const [completed, setCompleted] = useState({
    skills: false,
    equipments: false,
    weapons: false,
    abilities: false,
    creatures: false,
  });

  const isProd = import.meta.env.PROD;

  const assets = {
    title: isProd
      ? `/api/getAsset?assets=title`
      : import.meta.env.VITE_CLOUDINARY_TITLE,
    title_effect: isProd
      ? `/api/getAsset?assets=title_effect`
      : import.meta.env.VITE_CLOUDINARY_TITLE_EFFECT,
  };

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function forceCasing(str) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  }

  // Aggregations for summary
  let totalArmor = 0;
  let totalAllResistance = 0;
  let totalSpecificResistance = {};
  let skillSum = { ...secondary };
  let magicLevelBonus = 0;

  const addTo = (obj, key, value) => {
    obj[key] = (parseInt(obj[key]) || 0) + (parseInt(value) || 0);
  };

  const selectedEquipments = Object.values(equipment)
    .map((name) => equipmentsList.find((item) => item.name === name))
    .filter(Boolean);

  selectedEquipments.forEach((item) => {
    totalArmor += item.armor || 0;
    if (item.resistanceAll) totalAllResistance += item.resistanceAll;
    if (item.resistance) {
      Object.entries(item.resistance).forEach(([element, value]) => {
        addTo(totalSpecificResistance, element, value);
      });
    }
    if (item.skills) {
      Object.entries(item.skills).forEach(([skill, value]) => {
        addTo(skillSum, skill, value);
        if (skill === "magicLevel") magicLevelBonus += value;
      });
    }
  });

  const selectedWeaponObj = weaponsList.find(
    (item) => item.name === weapon.weapon
  );
  const selectedAmmoObj = weaponsList.find(
    (item) => item.name === weapon.ammunition
  );

  const avgDamage = (dmg) => {
    if (typeof dmg === "object" && dmg !== null) {
      return ((dmg.min || 0) + (dmg.max || 0)) / 2;
    }
    return dmg || 0;
  };

  const weaponAttack = selectedWeaponObj?.attack || 0;
  const weaponDamage = avgDamage(selectedWeaponObj?.damage);
  const ammoAttack = selectedAmmoObj?.attack || 0;
  const ammoDamage = avgDamage(selectedAmmoObj?.damage);

  let totalAttack = weaponAttack + ammoAttack;
  let totalDamage = weaponDamage + ammoDamage;

  if (selectedWeaponObj) {
    if (selectedWeaponObj.attack)
      addTo(skillSum, "attack", selectedWeaponObj.attack);
    if (selectedWeaponObj.damage)
      addTo(skillSum, "damage", avgDamage(selectedWeaponObj.damage));
    if (selectedWeaponObj.resistance) {
      Object.entries(selectedWeaponObj.resistance).forEach(
        ([element, value]) => {
          addTo(totalSpecificResistance, element, value);
        }
      );
    }
    if (selectedWeaponObj.skills) {
      Object.entries(selectedWeaponObj.skills).forEach(([skill, value]) => {
        addTo(skillSum, skill, value);
        if (skill === "magicLevel") magicLevelBonus += value;
      });
    }
  }

  if (selectedAmmoObj) {
    if (selectedAmmoObj.attack)
      addTo(skillSum, "attack", selectedAmmoObj.attack);
    if (selectedAmmoObj.damage)
      addTo(skillSum, "damage", avgDamage(selectedAmmoObj.damage));
    if (selectedAmmoObj.resistance) {
      Object.entries(selectedAmmoObj.resistance).forEach(([element, value]) => {
        addTo(totalSpecificResistance, element, value);
      });
    }
    if (selectedAmmoObj.skills) {
      Object.entries(selectedAmmoObj.skills).forEach(([skill, value]) => {
        addTo(skillSum, skill, value);
        if (skill === "magicLevel") magicLevelBonus += value;
      });
    }
  }

  const effectiveMagicLevel = (parseInt(main.magic) || 0) + magicLevelBonus;

  return (
    <div className="optimizer__form app-container">
      <div className="optimizer__content-wrapper">
        <div className="optimizer__title-wrapper">
          <img src={assets.title} alt="Title" className="optimizer__title" />
          <video
            src={assets.title_effect}
            autoPlay
            loop
            muted
            playsInline
            className="optimizer__title-overlay"
          />
          {!showMenu && (
            <button
              className="optimizer__begin-shine-btn"
              onClick={() => setShowMenu(true)}
              aria-label="Begin"
              type="button"
              style={{ position: "absolute", bottom: "8px" }}
            >
              BEGIN
            </button>
          )}
        </div>
        {intro ? (
          <div className="optimizer__collapse-overlay">
            <button
              className="optimizer__begin-optimize-btn"
              onClick={() => {
                setIntro(false);
                setTimeout(() => {
                  window.scrollTo({ top: 80, behavior: "smooth" });
                }, 10);
              }}
            >
              START PLAYING YOUR CHARACTER LIKE A PRO!
            </button>
          </div>
        ) : null}
        {showScroll && (
          <button
            className="optimizer__scroll-top-btn"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Scroll to top"
          >
            ↑
          </button>
        )}
      </div>

      {showMenu && (
        <div className="optimizer__overlay" onClick={() => setShowMenu(false)}>
          <div
            className="optimizer__overlay-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="optimizer__overlay-header">
              <button
                className="optimizer__restart-btn"
                onClick={() => setShowMenu(false)}
                type="button"
                aria-label="Abort"
              >
                ✖ Abort
              </button>
              <button
                className="optimizer__restart-btn"
                onClick={() => {
                  setMain({ vocation: "", level: "", magic: "" });
                  setSecondary({
                    sword: "",
                    axe: "",
                    club: "",
                    distance: "",
                    shield: "",
                  });
                  setEquipment({
                    helmet: "",
                    armor: "",
                    leg: "",
                    boot: "",
                    amulet: "",
                    ring: "",
                    trinket: "",
                    shield: "",
                    quiver: "",
                    spellbook: "",
                  });
                  setWeapon({ weapon: "", ammunition: "" });
                  setCompleted({
                    skills: false,
                    equipments: false,
                    weapons: false,
                    abilities: false,
                    creatures: false,
                  });
                }}
                type="button"
                aria-label="Restart"
              >
                ⟳ Restart
              </button>
            </div>
            <div className="optimizer__overlay-body">
              <div className="optimizer__overlay-left">
                <CircleMenu
                  items={[
                    {
                      key: "skills",
                      label: "SKILLS",
                      enabled: !!main.vocation,
                      done: completed.skills,
                    },
                    {
                      key: "equipments",
                      label: "EQUIP",
                      enabled: !!main.vocation && completed.skills,
                      done: completed.equipments,
                    },
                    {
                      key: "weapons",
                      label: "WEAPONS",
                      enabled:
                        !!main.vocation &&
                        completed.skills &&
                        completed.equipments,
                      done: completed.weapons,
                    },
                    {
                      key: "abilities",
                      label: "ABILITIES",
                      enabled:
                        !!main.vocation &&
                        completed.skills &&
                        completed.equipments &&
                        completed.weapons,
                      done: completed.abilities,
                    },
                    {
                      key: "creatures",
                      label: "CREATURES",
                      enabled:
                        !!main.vocation &&
                        completed.skills &&
                        completed.equipments &&
                        completed.weapons &&
                        completed.abilities,
                      done: completed.creatures,
                    },
                  ]}
                  onSelect={(key) => {
                    setActiveWindow(key);
                  }}
                  onClose={() => setShowMenu(false)}
                  vocation={main.vocation}
                  onVocationChange={(v) =>
                    setMain((m) => ({ ...m, vocation: v }))
                  }
                  interactive={!activeWindow}
                />
              </div>
              <div className="optimizer__overlay-right">
                {completed.skills &&
                  completed.equipments &&
                  completed.weapons &&
                  completed.abilities &&
                  completed.creatures && (
                    <div className="optimizer__equipment-summary">
                      <h3>Character Summary</h3>
                      <div className="optimizer__equipment-grid">
                        <p>
                          <strong>Vocation:</strong>{" "}
                          {forceCasing(main.vocation) || "None"}
                        </p>
                        <p>
                          <strong>Level:</strong> {main.level || "None"}
                        </p>
                        <p>
                          <strong>Magic Level:</strong> {main.magic || "None"}
                        </p>
                        <p>
                          <strong>Effective Magic Level:</strong>{" "}
                          {effectiveMagicLevel}
                        </p>
                        <p>
                          <strong>Weapon:</strong> {weapon.weapon || "None"}
                        </p>
                        <p>
                          <strong>Ammunition:</strong>{" "}
                          {weapon.ammunition || "None"}
                        </p>
                        <p>
                          <strong>Helmet:</strong> {equipment.helmet || "None"}
                        </p>
                        <p>
                          <strong>Armor:</strong> {equipment.armor || "None"}
                        </p>
                        <p>
                          <strong>Legs:</strong> {equipment.leg || "None"}
                        </p>
                        <p>
                          <strong>Boots:</strong> {equipment.boot || "None"}
                        </p>
                        <p>
                          <strong>Amulet:</strong> {equipment.amulet || "None"}
                        </p>
                        <p>
                          <strong>Ring:</strong> {equipment.ring || "None"}
                        </p>
                        <p>
                          <strong>Trinket:</strong>{" "}
                          {equipment.trinket || "None"}
                        </p>
                        {(() => {
                          const OFFHAND_SLOTS_BY_VOCATION = {
                            knight: ["shield"],
                            paladin: ["quiver", "shield"],
                            sorcerer: ["spellbook"],
                            druid: ["spellbook"],
                          };
                          const voc = main.vocation || "";
                          const offhandSlots =
                            OFFHAND_SLOTS_BY_VOCATION[voc] || [];
                          return offhandSlots.map((slot) => (
                            <p key={slot}>
                              <strong>{forceCasing(slot)}:</strong>{" "}
                              {equipment[slot] || "None"}
                            </p>
                          ));
                        })()}
                      </div>
                      <br />
                      <ul>
                        <li>
                          <strong>Total Armor:</strong> {totalArmor}
                        </li>
                        <li>
                          <strong>Total All Resistance:</strong>{" "}
                          {totalAllResistance}%
                        </li>
                        <li>
                          <strong>Total Element Specific Resistance:</strong>
                          <ul>
                            {Object.entries(totalSpecificResistance).map(
                              ([element, value]) => (
                                <li key={element}>
                                  {forceCasing(element)}: {value}%
                                </li>
                              )
                            )}
                          </ul>
                        </li>
                        <li>
                          <strong>Total Skills:</strong>
                          <ul>
                            {Object.entries(skillSum)
                              .filter(
                                ([skill]) =>
                                  skill !== "attack" && skill !== "damage"
                              )
                              .map(([skill, value]) => (
                                <li key={skill}>
                                  {forceCasing(skill)}: {value}
                                </li>
                              ))}
                          </ul>
                        </li>
                        <li>
                          <strong>Total Attack:</strong> {totalAttack}
                        </li>
                        <li>
                          <strong>Total Damage:</strong> {totalDamage}
                        </li>
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeWindow && (
        <div className="optimizer__window">
          <div className="optimizer__window-header">
            <h3 style={{ margin: 0 }}>{activeWindow.toUpperCase()}</h3>
            <div>
              <button
                className="optimizer__restart-btn"
                onClick={() => setActiveWindow(null)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
          {activeWindow === "skills" && (
            <Skills
              main={main}
              setMain={setMain}
              secondary={secondary}
              setSecondary={setSecondary}
            />
          )}
          {activeWindow === "equipments" && (
            <Equipments
              vocation={main.vocation}
              equipment={equipment}
              setEquipment={setEquipment}
            />
          )}
          {activeWindow === "weapons" && (
            <Weapons
              vocation={main.vocation}
              weapon={weapon}
              setWeapon={setWeapon}
            />
          )}
          {activeWindow === "abilities" && (
            <Abilities
              character={{
                ...main,
                magic: effectiveMagicLevel,
              }}
            />
          )}
          {activeWindow === "creatures" && (
            <Creatures vocation={main.vocation} />
          )}
          <div className="optimizer__window-footer">
            <button
              className="optimizer__restart-btn"
              type="button"
              onClick={() => {
                if (activeWindow)
                  setCompleted((c) => ({ ...c, [activeWindow]: true }));
                setActiveWindow(null);
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Form;
