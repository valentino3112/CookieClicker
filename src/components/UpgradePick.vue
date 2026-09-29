<script setup>
import { ref } from 'vue'
import { state } from '../store.js'
import { rollUpgrades } from '../upgrades.js'
import { pickUpgrade } from '../game.js'

// Slot machine: shuffle cards for ~0.8s, then land on the real roll
const cards = ref(rollUpgrades())
const settled = ref(false)
const picked = ref(null)
const spin = setInterval(() => (cards.value = rollUpgrades()), 80)
setTimeout(() => {
  clearInterval(spin)
  cards.value = rollUpgrades()
  settled.value = true
}, 800)

function choose(upgrade) {
  if (!settled.value || picked.value) return
  picked.value = upgrade
  setTimeout(() => pickUpgrade(upgrade), 400)
}
</script>

<template>
  <div class="overlay">
    <h2>🎰 Wave {{ state.wave }} cleared!</h2>
    <div class="cards">
      <button
        v-for="u in cards"
        :key="u.name"
        v-show="!picked || picked === u"
        class="card"
        :disabled="!settled"
        @click="choose(u)"
      >
        <strong>{{ u.name }}</strong>
        <span>{{ u.desc }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: absolute; inset: 0; cursor: default;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.4); color: #fff;
}
.cards { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.card {
  width: 10rem; height: 7rem; padding: 1rem; font-size: 1rem;
  display: flex; flex-direction: column; justify-content: center; gap: 0.5rem;
  background: #fff; border: 2px solid #c68a3c; border-radius: 8px; cursor: pointer;
}
.card:disabled { opacity: 0.6; cursor: default; }
</style>
