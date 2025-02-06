<template>
  <div class="page-layout">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
// Composant de mise en page
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
}
</style>
