export default function Summary({ characterDone, encounterDone, summaryData }) {
  const allDone = characterDone && encounterDone;

  return (
    <div className="optimizer__content">
      <div className="optimizer__summary-title"></div>

      <div className="optimizer__summary">
        <h2>Summary</h2>
        {!characterDone && <p>Character is not complete yet.</p>}
        {characterDone && !encounterDone && (
          <p>
            Encounter is locked until character is complete. Now you can fill
            creatures and players.
          </p>
        )}

        {summaryData && (
          <div className="optimizer__equipment-summary">
            <div className="optimizer__equipment-grid">
              <p>
                <strong>Vocation:</strong> {summaryData.vocation || "None"}
              </p>
              <p>
                <strong>Level:</strong> {summaryData.level || "None"}
              </p>
              <p>
                <strong>Magic Level:</strong> {summaryData.magicLevel || "None"}
              </p>
              <p>
                <strong>Effective Magic Level:</strong>{" "}
                {summaryData.effectiveMagicLevel ?? 0}
              </p>
              <p>
                <strong>Weapon:</strong> {summaryData.weapon?.weapon || "None"}
              </p>
              <p>
                <strong>Ammunition:</strong>{" "}
                {summaryData.weapon?.ammunition || "None"}
              </p>
              <p>
                <strong>Helmet:</strong>{" "}
                {summaryData.equipment?.helmet || "None"}
              </p>
              <p>
                <strong>Armor:</strong> {summaryData.equipment?.armor || "None"}
              </p>
              <p>
                <strong>Legs:</strong> {summaryData.equipment?.leg || "None"}
              </p>
              <p>
                <strong>Boots:</strong> {summaryData.equipment?.boot || "None"}
              </p>
              <p>
                <strong>Amulet:</strong>{" "}
                {summaryData.equipment?.amulet || "None"}
              </p>
              <p>
                <strong>Ring:</strong> {summaryData.equipment?.ring || "None"}
              </p>
              <p>
                <strong>Trinket:</strong>{" "}
                {summaryData.equipment?.trinket || "None"}
              </p>
            </div>
            <br />
            <ul>
              <li>
                <strong>Total Armor:</strong> {summaryData.totals?.armor ?? 0}
              </li>
              <li>
                <strong>Total All Resistance:</strong>{" "}
                {summaryData.totals?.resistanceAll ?? 0}%
              </li>
              <li>
                <strong>Total Element Specific Resistance:</strong>
                <ul>
                  {Object.entries(
                    summaryData.totals?.resistanceByElement || {},
                  ).map(([element, value]) => (
                    <li key={element}>
                      {element
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (s) => s.toUpperCase())}
                      : {value}%
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <strong>Total Skills:</strong>
                <ul>
                  {Object.entries(summaryData.totals?.skills || {}).map(
                    ([skill, value]) => (
                      <li key={skill}>
                        {skill
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (s) => s.toUpperCase())}
                        : {value}
                      </li>
                    ),
                  )}
                </ul>
              </li>
              <li>
                <strong>Total Attack:</strong> {summaryData.totals?.attack ?? 0}
              </li>
              <li>
                <strong>Total Damage:</strong> {summaryData.totals?.damage ?? 0}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
