<template>
  <div class="page-layout">
    <Navbar />
    <main class="main-content">
      <slot></slot>
    </main>
  </div>
</template>

<script setup lang="ts">
import Navbar from './Navbar.vue'
</script>

<style scoped>
.page-layout {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.user-info {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.username {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
}

.email {
  color: #666;
}

.current-date {
  color: #666;
  font-style: italic;
}

.content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
