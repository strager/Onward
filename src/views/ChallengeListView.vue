<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { activeChallenges, countToday, logOutcome } from '@/store'
</script>

<template>
  <main class="screen">
    <h1>Challenges</h1>

    <p v-if="activeChallenges.length === 0" class="empty">
      No challenges yet.
      <RouterLink to="/settings">Add your first challenge</RouterLink> to get started.
    </p>

    <ul v-else class="challenges">
      <li v-for="challenge in activeChallenges" :key="challenge.id" class="challenge">
        <div class="info">
          <span class="name">{{ challenge.name }}</span>
          <span class="count">{{ countToday(challenge.id) }} today</span>
        </div>
        <div class="buttons">
          <button
            type="button"
            class="face"
            aria-label="Log a good interaction"
            @click="logOutcome(challenge.id, 'success')"
          >
            😊
          </button>
          <button
            type="button"
            class="face"
            aria-label="Log a tough interaction"
            @click="logOutcome(challenge.id, 'failure')"
          >
            😟
          </button>
        </div>
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

.challenge {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid #e3e3e3;
  border-radius: 0.75rem;
  background: #fff;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.name {
  font-weight: 600;
  overflow-wrap: anywhere;
}

.count {
  font-size: 0.85rem;
  color: #777;
}

.buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.face {
  font-size: 1.6rem;
  line-height: 1;
  width: 3rem;
  height: 3rem;
  border: 1px solid #e3e3e3;
  border-radius: 0.75rem;
  background: #fafafa;
  cursor: pointer;
}

.face:hover {
  background: #f0f0f0;
}

.face:active {
  transform: scale(0.94);
}
</style>
