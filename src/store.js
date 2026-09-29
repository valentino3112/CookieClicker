import { reactive, computed } from 'vue'

export const REVEAL_AT = 100

// State
export const state = reactive({
  phase: 'clicker', // clicker | arena | upgrade | over
  cookies: 0,
  autoProduction: 0,
  // current run (synced from game.js)
  hp: 0,
  maxHp: 0,
  wave: 0,
  kills: 0,
  collected: 0,
  upgrades: [], // names of upgrades taken this run
})

// Getters
export const cookieCount = computed(() => state.cookies)
export const production = computed(() => state.autoProduction)
export const upgradeCost = computed(() => 10 * 2 ** state.autoProduction)
export const upgradeSummary = computed(() => {
  const counts = {}
  for (const name of state.upgrades) counts[name] = (counts[name] || 0) + 1
  return Object.entries(counts).map(([name, n]) => (n > 1 ? `${name} ×${n}` : name)).join(' · ')
})

// Mutations
export function click() {
  state.cookies++
  checkReveal()
}

export function buyUpgrade() {
  if (state.cookies < upgradeCost.value) return
  state.cookies -= upgradeCost.value
  state.autoProduction++
}

// Starts a survival run. Also used by "Play again", which skips the clicker.
export function startRun() {
  Object.assign(state, { phase: 'arena', hp: 100, maxHp: 100, wave: 1, kills: 0, collected: 0, upgrades: [] })
}

function checkReveal() {
  if (state.phase === 'clicker' && state.cookies >= REVEAL_AT) startRun()
}

// Actions
export function startProduction() {
  setInterval(() => {
    if (state.phase !== 'clicker') return
    state.cookies += state.autoProduction
    checkReveal()
  }, 1000)
}
