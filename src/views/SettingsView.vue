<script setup lang="ts">
import { ref } from 'vue'
import {
  activeChallenges,
  addChallenge,
  archiveChallenge,
  archivedChallenges,
  renameChallenge,
} from '@/store'
import type { Challenge } from '@/types'

const newName = ref('')

function add(): void {
  const created = addChallenge(newName.value)
  if (created !== null) newName.value = ''
}

function commitRename(challenge: Challenge, event: Event): void {
  const input = event.target as HTMLInputElement
  const value = input.value.trim()
  if (value === '') {
    input.value = challenge.name // restore; blank names aren't allowed
    return
  }
  renameChallenge(challenge.id, value)
}

function archive(challenge: Challenge): void {
  const ok = window.confirm(
    `Archive "${challenge.name}"? It will move to your archived list and leave the main screen.`,
  )
  if (ok) archiveChallenge(challenge.id)
}
</script>

<template>
  <main class="screen">
    <h1>Settings</h1>

    <form class="add" @submit.prevent="add">
      <input
        v-model="newName"
        type="text"
        placeholder="New challenge name"
        aria-label="New challenge name"
      />
      <button type="submit">Add</button>
    </form>

    <ul v-if="activeChallenges.length > 0" class="active">
      <li v-for="challenge in activeChallenges" :key="challenge.id">
        <input
          class="rename"
          :value="challenge.name"
          aria-label="Challenge name"
          @change="commitRename(challenge, $event)"
        />
        <button type="button" class="archive" @click="archive(challenge)">Archive</button>
      </li>
    </ul>
    <p v-else class="empty">Add a challenge above to start tracking.</p>

    <section v-if="archivedChallenges.length > 0" class="archived">
      <h2>Archived</h2>
      <ul>
        <li v-for="challenge in archivedChallenges" :key="challenge.id">{{ challenge.name }}</li>
      </ul>
    </section>
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

.add {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.add input {
  flex: 1;
  min-width: 0;
  padding: 0.6rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font: inherit;
}

.add button {
  padding: 0.6rem 1.1rem;
  border: none;
  border-radius: 0.5rem;
  background: #2f6fed;
  color: #fff;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.active {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.active li {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.rename {
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.7rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font: inherit;
}

.archive {
  padding: 0.55rem 0.9rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  background: #fafafa;
  font: inherit;
  cursor: pointer;
}

.archive:hover {
  background: #f0f0f0;
}

.empty {
  color: #777;
}

.archived {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.archived h2 {
  font-size: 1rem;
  color: #777;
  margin: 0 0 0.6rem;
}

.archived ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.archived li {
  padding: 0.5rem 0.7rem;
  color: #999;
  background: #f7f7f7;
  border-radius: 0.5rem;
}
</style>
