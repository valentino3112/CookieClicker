// Each upgrade mutates the player stats in game.js. Picking one twice applies it twice.
// Rarity later: add a `weight` field and use it in rollUpgrades.
export const UPGRADES = [
  { name: 'Cookie Shield', desc: '+20 Max HP', apply: p => { p.maxHp += 20; p.hp += 20 } },
  { name: 'Butter Turret', desc: '+1 projectile', apply: p => { p.projectiles++ } },
  { name: 'Milk Aura', desc: 'Slow nearby cursors by 20%', apply: p => { p.slow = 1 - (1 - p.slow) * 0.8 } },
  { name: 'Chocolate Armor', desc: '-10% damage taken', apply: p => { p.armor *= 0.9 } },
  { name: 'Cookie Orbitals', desc: '+1 orbiting cookie', apply: p => { p.orbitals++ } },
  { name: 'Honey', desc: '+20% cookies from cursors', apply: p => { p.dropMult += 0.2 } },
  { name: 'Coffee', desc: '+10% movement speed', apply: p => { p.speed *= 1.1 } },
  { name: 'Spicy Cookie', desc: '+15% damage', apply: p => { p.damage *= 1.15 } },
]

// Three different upgrades, equal odds.
export function rollUpgrades() {
  const pool = [...UPGRADES]
  return [0, 1, 2].map(() => pool.splice(Math.floor(Math.random() * pool.length), 1)[0])
}
