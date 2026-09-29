<script setup>
import { ref } from 'vue'
import { state, UPGRADES, cookieCount, production, costOf, click, buyUpgrade } from './store.js'

// make it more visual or something idk
const pops = ref([])
let nextId = 0

function onClick(e) {
  click()
  pops.value.push({ id: nextId++, x: e.clientX, y: e.clientY })
}

const removePop = id => (pops.value = pops.value.filter(p => p.id !== id))
</script>

<template>
  <h1>Cookie Clicker</h1>
  <p>Cookies: {{ cookieCount }}</p>
  <p>Auto production: {{ production }} / sec</p>
  <button class="big" aria-label="Click the cookie" @click="onClick">🍪</button>
  <span
    v-for="p in pops"
    :key="p.id"
    class="pop"
    :style="{ left: p.x + 'px', top: p.y + 'px' }"
    @animationend="removePop(p.id)"
  >+1</span>
  <div v-for="(u, id) in UPGRADES" :key="id">
    <p>{{ u.name }} (+{{ u.production }}/sec) · owned: {{ state.owned[id] }}</p>
    <button @click="buyUpgrade(id)" :disabled="cookieCount < costOf(id)">Buy for {{ costOf(id) }} cookies</button>
  </div>
</template>

<style>
body { font-family: sans-serif; text-align: center; margin-top: 3rem; }
.big {
  font-size: 6rem; margin: 1rem;
  background: none; border: none; padding: 0; cursor: pointer;
  transition: transform 0.05s;
}
.big:hover { transform: scale(1.05); }
.big:active { transform: scale(0.95); }
.pop {
  position: fixed; pointer-events: none; font-weight: bold;
  transform: translate(-50%, -50%);
  animation: float-up 0.7s ease-out forwards;
}
@keyframes float-up {
  to { transform: translate(-50%, -250%); opacity: 0; }
}
</style>
