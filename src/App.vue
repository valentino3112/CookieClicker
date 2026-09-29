<script setup>
import { state } from './store.js'
import Clicker from './components/Clicker.vue'
import Arena from './components/Arena.vue'
import GameOver from './components/GameOver.vue'
</script>

<template>
  <Clicker v-if="state.phase === 'clicker'" />
  <GameOver v-else-if="state.phase === 'over'" />
  <Arena v-else />
</template>

<style>
body { font-family: sans-serif; margin: 0; }
</style>
