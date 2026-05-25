<script setup lang="ts">
import { RouterLink } from 'vue-router'
import ChallengeRow from '@/components/ChallengeRow.vue'
import { activeChallenges } from '@/store'
import squiggle from '@/assets/flourish-squiggle.svg'
import plant from '@/assets/illus-plant.svg'
</script>

<template>
  <main class="screen">
    <header class="screen-header">
      <h1 class="screen-title">Challenges</h1>
      <img :src="squiggle" class="squiggle" alt="" />
    </header>

    <div v-if="activeChallenges.length === 0" class="card empty">
      <img :src="plant" class="empty-art" alt="" />
      <p class="empty-text">
        No challenges yet.
        <RouterLink to="/settings" class="empty-link">Add your first challenge</RouterLink> to begin.
      </p>
    </div>

    <ul v-else class="challenges">
      <li v-for="challenge in activeChallenges" :key="challenge.id">
        <ChallengeRow :challenge="challenge" />
      </li>
    </ul>
  </main>
</template>

<style scoped>
.squiggle {
  display: block;
  width: 150px;
  margin-top: -2px;
}

.challenges {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.empty {
  padding: 32px 24px;
  text-align: center;
}

.empty-art {
  width: 96px;
  height: 96px;
  margin: 0 auto 12px;
}

.empty-text {
  margin: 0;
  font-size: var(--fs-base);
  line-height: var(--lh-relaxed);
  color: var(--fg-muted);
}

.empty-link {
  color: var(--primary);
  font-weight: var(--fw-bold);
}
</style>
