import { useState, useEffect } from "react";
import { equipmentsList } from "../../../data/character/items/equipments";
import { weaponsList } from "../../../data/character/items/weapons";
import CharacterSection from "./section/character";
import EncounterSection from "./section/encounter";
import Summary from "./section/summary";

function Form() {
  const [main, setMain] = useState({ vocation: "", level: "", magic: "" });
  const [intro, setIntro] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeLeft, setActiveLeft] = useState(null);
  const [activeRight, setActiveRight] = useState(null);
  const [completedLeft, setCompletedLeft] = useState({
    skills: false,
    equipments: false,
    weapons: false,
    abilities: false,
  });
  const [completedRight, setCompletedRight] = useState({
    creatures: false,
    players: false,
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

  let totalArmor = 0;
  let totalAllResistance = 0;
  let totalSpecificResistance = {};
  let skillSum = {};
  let magicLevelBonus = 0;

  const addTo = (obj, key, value) => {
    obj[key] = (parseInt(obj[key]) || 0) + (parseInt(value) || 0);
  };

  const selectedEquipments = [];
  const selectedWeaponObj = undefined;
  const selectedAmmoObj = undefined;

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

  const effectiveMagicLevel = (parseInt(main.magic) || 0) + magicLevelBonus;

  const characterDone =
    completedLeft.skills &&
    completedLeft.equipments &&
    completedLeft.weapons &&
    completedLeft.abilities;
  const encounterDone = completedRight.creatures && completedRight.players;

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
                  setActiveLeft(null);
                  setActiveRight(null);
                  setCompletedLeft({
                    skills: false,
                    equipments: false,
                    weapons: false,
                    abilities: false,
                  });
                  setCompletedRight({ creatures: false, players: false });
                }}
                type="button"
                aria-label="Restart"
              >
                ⟳ Restart
              </button>
            </div>
            <div className="optimizer__overlay-body">
              <div className="optimizer__overlay-left">
                <CharacterSection
                  main={main}
                  setMain={setMain}
                  activeLeft={activeLeft}
                  setActiveLeft={setActiveLeft}
                  completedLeft={completedLeft}
                  setCompletedLeft={setCompletedLeft}
                />
              </div>
              <div className="optimizer__overlay-center">
                <Summary
                  characterDone={characterDone}
                  encounterDone={encounterDone}
                />
              </div>
              <div className="optimizer__overlay-right">
                <EncounterSection
                  main={main}
                  activeRight={activeRight}
                  setActiveRight={setActiveRight}
                  completedRight={completedRight}
                  setCompletedRight={setCompletedRight}
                  enabled={characterDone}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {}
    </div>
  );
}

export default Form;
