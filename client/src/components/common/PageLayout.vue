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
  background: var(--primary-dark);
  padding: 1rem 1.5rem;
  border-radius: 8px;
  color: white;
}

.page-header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Style uniforme des boutons d'action */
:deep(.btn-action) {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

:deep(.btn-primary) {
  background-color: var(--primary-color);
  color: white;
}

:deep(.btn-edit) {
  background-color: var(--info-color);
  color: white;
}

:deep(.btn-delete) {
  background-color: var(--danger-color);
  color: white;
}

:deep(.btn-action:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
}

:deep(.btn-action:active) {
  transform: translateY(0);
}

:deep(.btn-action i) {
  font-size: 1rem;
}
</style> 