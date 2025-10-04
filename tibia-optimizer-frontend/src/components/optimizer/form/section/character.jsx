import { useState, useEffect, useMemo, useRef } from "react";
import Skills from "../form-wrapper/character/skills";
import Equipments from "../form-wrapper/character/items/equipments";
import Weapons from "../form-wrapper/character/items/weapons";
import Abilities from "../form-wrapper/character/abilities";

function CircleMenuCharacter({
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
  const rOuter = useMemo(() => (size > 0 ? size / 2 - 4 : 150), [size]);
  const rInner = useMemo(
    () => (size > 0 ? Math.max(size * 0.25, 120) : 120),
    [size],
  );
  const cx = useMemo(() => (size > 0 ? size / 2 : 150), [size]);
  const cy = cx;

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
    const cxp = rect.left + rect.width / 2;
    const cyp = rect.top + rect.height / 2;
    const dx = e.clientX - cxp;
    const dy = e.clientY - cyp;
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
    const cxp = rect.left + rect.width / 2;
    const cyp = rect.top + rect.height / 2;
    const dx = e.clientX - cxp;
    const dy = e.clientY - cyp;
    const r = Math.sqrt(dx * dx + dy * dy);
    const innerRadius = Math.max(Math.min(rect.width, rect.height) * 0.26, 120);
    if (r < innerRadius) return;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    const deg = (angle + 360 + 90) % 360;
    const index = Math.floor(deg / sliceDeg);
    const item = items[index];
    if (item && item.enabled) onSelect(item.key);
  };

  const polarToCartesian = (cx, cy, r, deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arcPath = (cx, cy, rOuter, rInner, startAngle, endAngle) => {
    const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
    const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
    const startInner = polarToCartesian(cx, cy, rInner, startAngle);
    const endInner = polarToCartesian(cx, cy, rInner, endAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${endOuter.x} ${endOuter.y}`,
      `L ${startInner.x} ${startInner.y}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 1 ${endInner.x} ${endInner.y}`,
      "Z",
    ].join(" ");
  };

  return (
    <div
      className="optimizer__circle"
      ref={ref}
      onMouseMove={onPointerMove}
      onMouseLeave={onPointerLeave}
      onMouseUp={onPointerUp}
      role="menu"
      aria-label="Character sections"
    >
      <svg
        className="optimizer__circle-svg"
        width={size || 300}
        height={size || 300}
        viewBox={`0 0 ${size || 300} ${size || 300}`}
        aria-hidden="true"
      >
        {items.map((it, i) => {
          const start = i * sliceDeg;
          const end = (i + 1) * sliceDeg;
          const fill = it.enabled
            ? "rgba(0, 255, 255, 0.08)"
            : "rgba(180, 180, 180, 0.08)";
          const d = arcPath(cx, cy, rOuter, rInner, start, end);
          return (
            <path
              key={`slice-${it.key}`}
              d={d}
              fill={fill}
              pointerEvents={interactive && it.enabled ? "auto" : "none"}
              onMouseEnter={() => it.enabled && interactive && setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex((hi) => (hi === i ? null : hi))}
              onClick={() => it.enabled && interactive && onSelect(it.key)}
              style={{
                cursor: it.enabled && interactive ? "pointer" : "default",
              }}
            />
          );
        })}
        {items.map((_, i) => {
          const a = i * sliceDeg;
          const p1 = polarToCartesian(cx, cy, rInner, a);
          const p2 = polarToCartesian(cx, cy, rOuter, a);
          return (
            <line
              key={`sep-${i}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke="rgba(255, 140, 0, 0.9)"
              strokeWidth={2}
              strokeLinecap="round"
              shapeRendering="geometricPrecision"
              pointerEvents="none"
            />
          );
        })}
        {hoverIndex != null &&
          (() => {
            const start = hoverIndex * sliceDeg;
            const end = (hoverIndex + 1) * sliceDeg;
            const d = arcPath(cx, cy, rOuter, rInner, start, end);
            return (
              <path d={d} fill="rgba(0,255,255,0.22)" pointerEvents="none" />
            );
          })()}
      </svg>
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
    </div>
  );
}

export default function CharacterSection({
  main,
  setMain,
  activeLeft,
  setActiveLeft,
  completedLeft,
  setCompletedLeft,
}) {
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
  const [weapon, setWeapon] = useState({ weapon: "", ammunition: "" });

  const leftItems = [
    {
      key: "skills",
      label: "SKILLS",
      enabled: !!main.vocation,
      done: completedLeft.skills,
    },
    {
      key: "equipments",
      label: "EQUIP",
      enabled: !!main.vocation && completedLeft.skills,
      done: completedLeft.equipments,
    },
    {
      key: "weapons",
      label: "WEAPONS",
      enabled:
        !!main.vocation && completedLeft.skills && completedLeft.equipments,
      done: completedLeft.weapons,
    },
    {
      key: "abilities",
      label: "ABILITIES",
      enabled:
        !!main.vocation &&
        completedLeft.skills &&
        completedLeft.equipments &&
        completedLeft.weapons,
      done: completedLeft.abilities,
    },
  ];

  return (
    <div className="optimizer__section optimizer__section--character">
      <CircleMenuCharacter
        items={leftItems}
        onSelect={(key) => setActiveLeft(key)}
        vocation={main.vocation}
        onVocationChange={(v) => setMain((m) => ({ ...m, vocation: v }))}
        interactive={!activeLeft}
      />
      {activeLeft && (
        <div className="optimizer__window">
          <div className="optimizer__window-header">
            <h3 style={{ margin: 0 }}>{activeLeft.toUpperCase()}</h3>
            <div>
              <button
                className="optimizer__restart-btn"
                onClick={() => setActiveLeft(null)}
                type="button"
              >
                Close
              </button>
            </div>
          </div>
          {activeLeft === "skills" && (
            <Skills
              main={main}
              setMain={setMain}
              secondary={secondary}
              setSecondary={setSecondary}
            />
          )}
          {activeLeft === "equipments" && (
            <Equipments
              vocation={main.vocation}
              equipment={equipment}
              setEquipment={setEquipment}
            />
          )}
          {activeLeft === "weapons" && (
            <Weapons
              vocation={main.vocation}
              weapon={weapon}
              setWeapon={setWeapon}
            />
          )}
          {activeLeft === "abilities" && <Abilities character={{ ...main }} />}
          <div className="optimizer__window-footer">
            <button
              className="optimizer__restart-btn"
              type="button"
              onClick={() => {
                if (activeLeft)
                  setCompletedLeft((c) => ({ ...c, [activeLeft]: true }));
                setActiveLeft(null);
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
