import { useState, useEffect } from "react";

function Creatures() {
  const [creature, setCreature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const forceCasing = (str) =>
    str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

  const placeholderCreature = {
    name: "Creature",
  };

  let data = Array.isArray(creature)
    ? creature
    : [creature || placeholderCreature];

  return <div>Creatures Component</div>;
}

export default Creatures;
