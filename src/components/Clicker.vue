<script setup>
import { cookieCount, production, upgradeCost, click, buyUpgrade } from '../store.js'
</script>

<template>
  <div class="clicker">
    <h1>🍪 Cookie Clicker</h1>
    <p>Cookies: {{ cookieCount }}</p>
    <p>Auto production: {{ production }} / sec</p>
    <button class="big" @click="click">🍪 Click</button>
    <p>Next upgrade: {{ upgradeCost }} cookies</p>
    <button @click="buyUpgrade" :disabled="cookieCount < upgradeCost">Buy upgrade</button>
  </div>
</template>

<style scoped>
.clicker { text-align: center; margin-top: 3rem; }
.big { font-size: 2rem; padding: 1rem 2rem; margin: 1rem; }
</style>
