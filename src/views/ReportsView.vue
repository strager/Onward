<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StatCard from '@/components/StatCard.vue'
import { activeChallenges } from '@/store'
import squiggle from '@/assets/flourish-squiggle.svg'
import plant from '@/assets/illus-plant.svg'

// Active challenges only, consistent with the Challenges screen.
</script>

<template>
  <main class="screen">
    <header class="screen-header">
      <h1 class="screen-title">Reports</h1>
      <img :src="squiggle" class="squiggle" alt="" />
    </header>

    <div v-if="activeChallenges.length === 0" class="card empty">
      <img :src="plant" class="empty-art" alt="" />
      <p class="empty-text">
        Nothing to report yet.
        <RouterLink :to="{ path: '/settings', state: { focusNew: true } }" class="empty-link">Add a challenge</RouterLink> and start logging.
      </p>
    </div>

    <ul v-else class="cards">
      <li v-for="challenge in activeChallenges" :key="challenge.id">
        <RouterLink :to="`/reports/${challenge.id}`" class="card-link">
          <StatCard :challenge="challenge" />
        </RouterLink>
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

.cards {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-link {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: var(--r-lg);
  transition: transform var(--dur-fast) var(--ease-out);
}
.card-link:active {
  transform: translateY(2px);
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
