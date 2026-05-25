<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ChallengeRow from '@/components/ChallengeRow.vue'
import { activeChallenges } from '@/store'
</script>

<template>
  <main class="screen">
    <h1>Challenges</h1>

    <p v-if="activeChallenges.length === 0" class="empty">
      No challenges yet.
      <RouterLink to="/settings">Add your first challenge</RouterLink> to get started.
    </p>

    <ul v-else class="challenges">
      <li v-for="challenge in activeChallenges" :key="challenge.id">
        <ChallengeRow :challenge="challenge" />
      </li>
    </ul>
  </main>
</template>

<style scoped>
.screen {
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  font-family: system-ui, sans-serif;
}

h1 {
  margin: 0 0 1.25rem;
  font-size: 1.5rem;
}

.empty {
  color: #555;
  line-height: 1.5;
}

.challenges {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
