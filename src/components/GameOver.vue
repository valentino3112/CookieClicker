<script setup>
import { state, upgradeSummary, startRun } from '../store.js'
</script>

<template>
  <div class="over">
    <h1>💀 The cursors got you</h1>
    <p>Wave reached: {{ state.wave }}</p>
    <p>Cookies collected: {{ state.collected }}</p>
    <p>Cursors killed: {{ state.kills }}</p>
    <p>Upgrades: {{ upgradeSummary || 'none' }}</p>
    <button @click="startRun">Play again</button>
  </div>
</template>

<style scoped>
.over { text-align: center; margin-top: 3rem; }
button { font-size: 1.25rem; padding: 0.5rem 1.5rem; }
</style>
