<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { state, upgradeSummary } from '../store.js'
import { start, stop } from '../game.js'
import UpgradePick from './UpgradePick.vue'

const canvas = ref()
onMounted(() => start(canvas.value))
onUnmounted(stop)
</script>

<template>
  <div class="arena">
    <canvas ref="canvas"></canvas>
    <div class="hud">
      <div>🍪 {{ state.cookies }} · ❤️ {{ state.hp }} / {{ state.maxHp }} · Wave {{ state.wave }} · Kills {{ state.kills }}</div>
      <div v-if="upgradeSummary" class="upgrades">{{ upgradeSummary }}</div>
    </div>
    <UpgradePick v-if="state.phase === 'upgrade'" />
  </div>
</template>

<style scoped>
/* The real mouse pointer "leaves" at the reveal */
.arena { position: fixed; inset: 0; cursor: none; overflow: hidden; }
canvas { display: block; width: 100%; height: 100%; }
.hud { position: absolute; top: 0.75rem; left: 1rem; font-size: 1.1rem; pointer-events: none; }
.upgrades { font-size: 0.85rem; opacity: 0.7; margin-top: 0.25rem; }
</style>
