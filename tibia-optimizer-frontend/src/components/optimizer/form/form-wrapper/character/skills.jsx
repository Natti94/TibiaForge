function Skills({ main, setMain, secondary, setSecondary }) {
  const VOCATION_MODIFIERS = {
    knight: { health: 15, mana: 5, melee: 1.0, distance: 0.55, magic: 0.3 },
    paladin: { health: 10, mana: 15, melee: 0.7, distance: 1.0, magic: 0.5 },
    sorcerer: { health: 5, mana: 30, melee: 0.3, distance: 0.4, magic: 1.0 },
    druid: { health: 5, mana: 30, melee: 0.3, distance: 0.4, magic: 1.0 },
    "": { health: 0, mana: 0, melee: 0.5, distance: 0.5, magic: 0.5 },
  };

  const isProd = import.meta.env.PROD;

  const assets = {
    level: isProd
      ? `/api/getAsset?assets=levelIcon`
      : import.meta.env.VITE_CLOUDINARY_LEVEL_ICON,
    magic: isProd
      ? `/api/getAsset?assets=magicLevel_icon`
      : import.meta.env.VITE_CLOUDINARY_MAGIC_LEVEL_ICON,
    health: isProd
      ? `/api/getAsset?assets=healthPoint_icon`
      : import.meta.env.VITE_CLOUDINARY_HEALTH_POINT_ICON,
    mana: isProd
      ? `/api/getAsset?assets=manaPoint_icon`
      : import.meta.env.VITE_CLOUDINARY_MANA_POINT_ICON,
    sword: isProd
      ? `/api/getAsset?assets=swordFighting_icon`
      : import.meta.env.VITE_CLOUDINARY_SWORD_FIGHTING_ICON,
    axe: isProd
      ? `/api/getAsset?assets=axeFighting_icon`
      : import.meta.env.VITE_CLOUDINARY_AXE_FIGHTING_ICON,
    club: isProd
      ? `/api/getAsset?assets=clubFighting_icon`
      : import.meta.env.VITE_CLOUDINARY_CLUB_FIGHTING_ICON,
    distance: isProd
      ? `/api/getAsset?assets=distanceFighting_icon`
      : import.meta.env.VITE_CLOUDINARY_DISTANCE_FIGHTING_ICON,
    fist: isProd
      ? `/api/getAsset?assets=fistFighting_icon`
      : import.meta.env.VITE_CLOUDINARY_FIST_FIGHTING_ICON,
    shield: isProd
      ? `/api/getAsset?assets=shielding_icon`
      : import.meta.env.VITE_CLOUDINARY_SHIELDING_ICON,
  };

  const forceCasing = (str) => {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  };

  const handleMainChange = (e) => {
    const { name, value } = e.target;
    setMain((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecondaryChange = (e) => {
    const { name, value } = e.target;
    setSecondary((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getVocationModifier = (vocation, type) => {
    const mods = VOCATION_MODIFIERS[vocation] || VOCATION_MODIFIERS[""];
    return mods[type] || 1;
  };

  const levelNum = parseInt(main.level) || 0;
  const vocationMods =
    VOCATION_MODIFIERS[main.vocation] || VOCATION_MODIFIERS[""];
  const calculatedHealth = levelNum * vocationMods.health;
  const calculatedMana = levelNum * vocationMods.mana;

  return (
    <div>
      <form>
        {!main.vocation && (
          <div className="optimizer__select-vocation-message">
            <strong>🛈 Please select a vocation to view and edit this.</strong>
          </div>
        )}
        <div
          className={`optimizer__vocation-content${
            main.vocation ? " optimizer__vocation-content--show" : ""
          }`}
        >
          {main.vocation && (
            <div className="optimizer__row">
              <div className="optimizer__col-main">
                <div className="optimizer__skills-main">
                  <label>
                    <h3>Main Attributes</h3>
                    <img src={assets.level} alt="Level Icon" /> Level:
                    <br />
                    <input
                      type="number"
                      name="level"
                      value={main.level}
                      onChange={handleMainChange}
                      min="1"
                      className="optimizer__skill-input"
                    />
                  </label>
                  <label>
                    <img src={assets.magic} alt="Magic Level Icon" /> Magic
                    Level:
                    <br />
                    <input
                      type="number"
                      name="magic"
                      value={main.magic}
                      onChange={handleMainChange}
                      min="1"
                      className="optimizer__skill-input"
                    />
                  </label>
                  <label>
                    <img src={assets.health} alt="Hit Point Icon" /> Health:
                    <br />
                    <input
                      type="number"
                      value={calculatedHealth}
                      readOnly
                      className="optimizer__skill-input"
                      tabIndex={-1}
                    />
                  </label>
                  <label>
                    <img src={assets.mana} alt="Mana Point Icon" /> Mana:
                    <br />
                    <input
                      type="number"
                      value={calculatedMana}
                      readOnly
                      className="optimizer__skill-input"
                      tabIndex={-1}
                    />
                  </label>
                </div>
              </div>
              <div className="optimizer__col-side">
                <div className="optimizer__skills-secondary">
                  <h3>Secondary Attributes</h3>
                  {Object.keys(secondary).map((skill) => (
                    <label key={skill}>
                      <img
                        src={assets[skill]}
                        alt={`${forceCasing(skill)} Icon`}
                        className="optimizer__skill-icon"
                      />
                      {forceCasing(skill)}:
                      <br />
                      <input
                        type="number"
                        name={skill}
                        value={secondary[skill]}
                        onChange={handleSecondaryChange}
                        min="0"
                        className="optimizer__skill-input"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
      {main.vocation && (
        <>
          <div>
            <h4>Main Attributes</h4>
            <ul>
              <li>Vocation: {forceCasing(main.vocation)}</li>
              <li>Level: {main.level}</li>
              <li>Health: {calculatedHealth}</li>
              <li>Mana: {calculatedMana}</li>
              <li>Magic: {main.magic}</li>
            </ul>
          </div>
          <div>
            <h4>Secondary Attributes</h4>
            <ul>
              {Object.entries(secondary).map(([skill, value]) => (
                <li key={skill}>
                  {forceCasing(skill)}: {value} <br />
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Vocational Skill Modifiers</h3>
            <p>
              Your vocation is <strong>{forceCasing(main.vocation)}.</strong>
            </p>
            <ul>
              <li>
                Melee: {getVocationModifier(main.vocation, "melee") * 100}%
              </li>
              <li>
                Distance: {getVocationModifier(main.vocation, "distance") * 100}
                %
              </li>
              <li>
                Magic: {getVocationModifier(main.vocation, "magic") * 100}%
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default Skills;
