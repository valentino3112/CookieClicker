<script setup>
import { state, UPGRADES, cookieCount, production, costOf, click, buyUpgrade } from './store.js'
</script>

<template>
  <h1>🍪 Cookie Clicker</h1>
  <p>Cookies: {{ cookieCount }}</p>
  <p>Auto production: {{ production }} / sec</p>
  <button class="big" @click="click">🍪 Click</button>
  <div v-for="(u, id) in UPGRADES" :key="id">
    <p>{{ u.name }} (+{{ u.production }}/sec) · owned: {{ state.owned[id] }}</p>
    <button @click="buyUpgrade(id)" :disabled="cookieCount < costOf(id)">Buy for {{ costOf(id) }} cookies</button>
  </div>
</template>

<style>
body { font-family: sans-serif; text-align: center; margin-top: 3rem; }
.big { font-size: 2rem; padding: 1rem 2rem; margin: 1rem; }
</style>
