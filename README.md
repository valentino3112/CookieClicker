# CookieClicker

A tiny Cookie Clicker demo... until you reach 100 cookies. Built with Vue 3 and Vite.

See [GAME_DESIGN.md](GAME_DESIGN.md) for the design.

## Run

```sh
npm install
npm run dev
```

Move with **WASD**. Attacks are automatic.

## Structure

- `src/store.js`: shared state, getters, mutations, and the auto-production action
- `src/game.js`: the survival arena: canvas loop, movement, cursors, attacks, waves
- `src/upgrades.js`: the upgrade pool and the random 3-card roll
- `src/components/`: `Clicker`, `Arena` (canvas + HUD), `UpgradePick` (slot machine), `GameOver`
- `src/App.vue`: picks the screen for the current phase
