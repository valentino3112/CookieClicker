# GAME DESIGN — Cookie Cursor

## Game Concept

The game begins as an intentionally simple Cookie Clicker-style demo.

The player clicks a cookie to generate cookies.

The important twist is that this is a bait-and-switch.

The game initially looks like a boring/simple Cookie Clicker demo. The player should not be told that anything unusual is coming.

When the player reaches **100 cookies**, the game changes dramatically.

The cookie becomes the player's character.

The player is now inside a survival arena and is attacked by hostile mouse cursors.

The game becomes a combination of:

- bullet hell
- Vampire Survivors-style survival
- roguelike upgrade selection

The core fantasy is:

**Click cookies → become a cookie → fight cursors → collect cookies → survive → become stronger → fight more cursors.**

---

## Phase 1 — Cookie Clicker

From 0 to 99 cookies:

- A large cookie is displayed.
- Clicking it gives +1 cookie.
- The interface is intentionally simple.
- No enemies.
- No complicated upgrades. The only upgrade is a simple auto-production upgrade (+1 cookie/sec, costs 10, then ×2 each time). It makes the fake demo feel real.
- No indication that a survival game is coming.

The player should genuinely believe they are playing a tiny Cookie Clicker demo.

---

## The 100-Cookie Reveal

At 100 cookies:

- The Cookie Clicker interface disappears/transitions into the game.
- The player becomes a cookie character.
- A larger arena appears.
- Hostile mouse cursors begin spawning.
- The player must survive.

The reveal should be surprising but not overly cinematic.

The real mouse pointer is hidden in the arena: the player's own pointer "leaves" and the cursors become the enemy.

The reveal only happens once per page load. After a game over, "Play again" starts directly at wave 1.

---

## Survival Gameplay

The player controls the cookie using WASD.

Cursors spawn around the edges of the arena and move toward the player.

The player has:

- health
- movement speed
- automatic attacks
- defensive upgrades

The player does not need to manually aim every attack.

Combat should have a Vampire Survivors-like feel where positioning and movement are important while attacks happen automatically.

---

## Enemies

The first enemy is the basic mouse cursor.

Basic cursor:

- Moves toward the player.
- Damages the player on contact.
- Has health.
- Can be killed.
- Drops cookies when killed.

Enemy difficulty should increase as the run progresses.

The initial implementation only needs the basic cursor enemy.

Future enemy types can be added later.

---

## Cookies

Cookies remain the central resource of the game.

During the survival phase, killing cursors causes cookies to drop.

The player collects these cookies by walking over them.

Each cookie collected heals 1 HP. This gives cookies a use during a run (and makes Honey meaningful).

When a wave ends, any cookies left on the ground are collected automatically.

Cookies should eventually have additional uses, but the initial game should keep the economy simple.

---

## Waves

The game is divided into waves.

A wave spawns a number of cursors.

Example progression:

- Wave 1 → 5 cursors
- Wave 2 → 8 cursors
- Wave 3 → 12 cursors

Later waves should gradually become more difficult through:

- more enemies
- faster enemies
- stronger enemies
- eventually new enemy types

A wave ends when its enemies have been defeated.

Wave size follows `(w² + 3w + 6) / 2`: 5, 8, 12, 17, 23, …
Cursor health grows ×1.1 per wave and speed ×1.05 per wave.

---

## Roguelike Upgrade System

After completing a wave, the game pauses and presents **three randomly selected upgrades**.

The player chooses exactly one.

The game then resumes.

The loop is:

```text
Wave
  ↓
Kill cursors
  ↓
Collect cookies
  ↓
Complete wave
  ↓
🎰 Random upgrade selection
  ↓
Choose ONE upgrade
  ↓
Upgrade applied
  ↓
Next wave
```

The upgrade selection should feel like a small **slot machine**.

When the selection appears:

- Three upgrade cards are displayed.
- The cards briefly cycle through possible upgrades.
- After roughly 0.5–1 second, they stop on the actual random choices.
- The player selects one.
- The other two disappear.

The animation should be simple.

The point is to create anticipation around what the player will roll.

---

## Initial Upgrade Pool

The initial game should contain these upgrades.

### Cookie Shield

Increases maximum health.

Example:

`+20 Max HP`

### Butter Turret

Adds/increases automatic projectiles.

Example:

`+1 projectile`

### Milk Aura

Slows nearby cursors.

Example:

`+10% slow effectiveness`

### Chocolate Armor

Reduces incoming damage.

Example:

`-10% damage taken`

### Cookie Orbitals

Adds cookies orbiting the player.

Orbitals damage cursors when they touch them.

Example:

`+1 orbital`

### Honey

Increases cookie drops from enemies.

Example:

`+20% cookies from enemies`

### Coffee

Increases movement speed.

Example:

`+10% movement speed`

### Spicy Cookie

Increases attack damage.

Example:

`+15% damage`

---

## Upgrade Selection Rules

Each selection contains three different upgrades.

Do not show the same upgrade twice in the same selection.

Previously selected upgrades can appear again in future selections.

Upgrades can stack.

For example:

```text
Coffee → Coffee
```

means the player gets the movement-speed bonus twice.

Likewise:

```text
Butter Turret → Butter Turret → Butter Turret
```

should progressively increase projectile count.

Initially all upgrades have equal rarity.

### Stacking rules

- The first pick of an ability (Milk Aura, Cookie Orbitals) activates it; later picks strengthen it.
- Percentage reductions stack multiplicatively so they never reach 100%: Chocolate Armor is `0.9ⁿ` damage taken, Milk Aura is `1 − 0.8ⁿ` slow.

The architecture should allow rarity to be added later, but rarity should **not** be implemented yet.

---

## Player Progression

The player should gradually become stronger through upgrade choices.

A successful run should feel like:

```text
Weak cookie
     ↓
Survive
     ↓
Choose upgrades
     ↓
Stronger attacks / defenses
     ↓
Survive harder waves
     ↓
More cursors
     ↓
More cookies
     ↓
More upgrades
     ↓
Powerful cookie
```

The game should emphasize build variety rather than simply increasing one number.

---

## Visual Identity

The game should be playful and minimal.

Important visual themes:

- cookies
- mouse cursors
- simple arena
- simple projectiles
- simple upgrade cards
- slot-machine feeling

Avoid making it visually complicated.

The humor comes from the absurd premise:

**A Cookie Clicker cookie is suddenly fighting an army of mouse cursors.**

---

## UI

During survival gameplay, the HUD should show:

- Cookies
- HP
- Wave
- Cursors killed
- Upgrade state when appropriate

The arena should occupy most of the screen.

The UI should remain readable and minimal.

---

## Game Over

If the player's health reaches zero:

- End the run.
- Show a simple game-over screen.
- Show basic statistics such as:
  - wave reached
  - cookies collected
  - cursors killed
  - upgrades obtained

Initially there does not need to be any permanent progression.

A new run starts from wave 1 with a fresh cookie (the clicker phase is not replayed).

---

## Scope

The first playable version should ONLY focus on:

1. Cookie clicking.
2. The 100-cookie reveal.
3. Player movement.
4. Cursor enemies.
5. Automatic attacks.
6. Cookie drops.
7. Waves.
8. Roguelike three-choice upgrade selection.
9. Basic upgrades.
10. Game over.

Do NOT add yet:

- bosses
- multiple enemy types
- permanent progression
- shops
- rerolls
- upgrade rarity
- achievements
- quests
- multiplayer
- accounts
- backend
- database
- procedural maps
- complicated inventories

These are potential future features, not part of the initial scope.

---

## Design Philosophy

The game should be:

- simple to understand
- surprising
- funny
- replayable
- progressively more chaotic
- easy to expand

The core loop should be fun before adding complexity.

---

## Development Rule

`GAME_DESIGN.md` is the source of truth for the game's design.

Before making gameplay changes, inspect this document and the existing implementation.

If the game's design is deliberately changed, update this document so it remains accurate.

Do not add features that are outside the current scope unless explicitly requested.
