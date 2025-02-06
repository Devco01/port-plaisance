<template>
  <div class="page-container">
    <div class="page-header">
      <h1>{{ title }}</h1>
      <div class="header-actions">
        <slot name="header-actions"></slot>
      </div>
    </div>

    <div class="main-content">
      <div class="content-card">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageLayout',
  props: {
    title: {
      type: String,
      required: true
    }
  }
})
</script>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}
</style>
