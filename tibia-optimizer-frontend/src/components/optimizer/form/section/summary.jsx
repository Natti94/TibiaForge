export default function Summary({ characterDone, encounterDone }) {
  const allDone = characterDone && encounterDone;

  return (
    <div className="optimizer__content">
      <div className="optimizer__summary-title"></div>

      <div className="optimizer__summary">
        {allDone ? (
          <div>
            <h2>Summary</h2>
            <p>Character and encounter are set. You can proceed.</p>
          </div>
        ) : (
          <div>
            <h2>Summary</h2>
            <p>Complete both circles to see results.</p>
            {!characterDone && <p>Character is not complete yet.</p>}
            {characterDone && !encounterDone && (
              <p>
                Encounter is locked until character is complete. Now you can
                fill creatures and players.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
