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

  const assets = {
    creature_avatar: import.meta.env.VITE_CLOUDINARY_PLAYER_AVATAR,
  };

  let data = Array.isArray(creature)
    ? creature
    : [creature || placeholderCreature];

  return (
    <div>
      {data.map((creature) => (
        <div key={creature.id}>
          <h3>{creature.name}</h3>
          <img src={assets.creature_avatar} alt={creature.name} />
        </div>
      ))}
    </div>
  );
}

export default Creatures;
