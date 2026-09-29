import { reactive, computed } from 'vue'

export const UPGRADES = {
  cursor: { name: '👆 Cursor', baseCost: 10, production: 1 },
  grandma: { name: '👵 Grandma', baseCost: 100, production: 5 },
}

// State
export const state = reactive({
  cookies: 0,
  autoProduction: 0,
  owned: { cursor: 0, grandma: 0 },
})

// Getters
export const cookieCount = computed(() => state.cookies)
export const production = computed(() => state.autoProduction)
export const costOf = id => UPGRADES[id].baseCost * 2 ** state.owned[id]

// Mutations
export function click() {
  state.cookies++
}

export function buyUpgrade(id) {
  if (state.cookies < costOf(id)) return
  state.cookies -= costOf(id)
  state.owned[id]++
  state.autoProduction += UPGRADES[id].production
}

// Actions
export function startProduction() {
  setInterval(() => {
    state.cookies += state.autoProduction
  }, 1000)
}
