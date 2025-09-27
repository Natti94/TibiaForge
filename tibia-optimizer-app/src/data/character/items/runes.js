export const runesList = [
  // DAMAGE RUNES
  {
    name: "Sudden Death Rune",
    type: "offensive",
    typeDamage: "Death",
    minFactor: 1.1,
    maxFactor: 1.9,
  },
  {
    name: "Light Magic Missile",
    type: "offensive",
    typeDamage: "Energy",
    minFactor: 0.1,
    maxFactor: 0.2,
  },
  {
    name: "Energy Strike",
    type: "offensive",
    typeDamage: "Energy",
    minFactor: 0.25,
    maxFactor: 0.55,
  },
  {
    name: "Fire Strike",
    type: "offensive",
    typeDamage: "Fire",
    minFactor: 0.25,
    maxFactor: 0.55,
  },
  {
    name: "Ultimate Explosion Rune",
    type: "offensive",
    typeDamage: "Fire",
    minFactor: 2.3,
    maxFactor: 3.0,
    minSubtract: 30,
    maxSubtract: 0,
    effect: "Deals massive fire damage in an area.",
    manaCost: 140,
  },
  // HEALING RUNES
];
