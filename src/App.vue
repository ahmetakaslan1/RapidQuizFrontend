<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="container">
    <RouterView />
  </main>
</template>

<style>
/* Global layout styles specific to the main wrapper can go here */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
</style>
