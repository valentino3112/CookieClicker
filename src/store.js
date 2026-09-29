import { reactive, computed } from 'vue'

// State
export const state = reactive({
  cookies: 0,
  autoProduction: 0,
})

// Getters
export const cookieCount = computed(() => state.cookies)
export const production = computed(() => state.autoProduction)
export const upgradeCost = computed(() => 10 * 2 ** state.autoProduction)

// Mutations
export function click() {
  state.cookies++
}

export function buyUpgrade() {
  if (state.cookies < upgradeCost.value) return
  state.cookies -= upgradeCost.value
  state.autoProduction++
}

// Actions
export function startProduction() {
  setInterval(() => {
    state.cookies += state.autoProduction
  }, 1000)
}
