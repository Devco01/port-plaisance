<template>
  <PageLayout title="Gestion des Utilisateurs">
    <template #header-actions>
      <button @click="showAddForm = true" class="btn-action btn-primary">
        <i class="fas fa-plus"></i> Nouvel Utilisateur
      </button>
    </template>

    <UserList />
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PageLayout from '@/components/common/PageLayout.vue'
import UserList from '@/components/Users/UserList.vue'

export default defineComponent({
  name: 'UsersView',
  components: {
    PageLayout,
    UserList
  }
})
</script>
