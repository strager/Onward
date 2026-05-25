<script setup lang="ts">
import { ref } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
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
    `Archive "${challenge.name}"? It moves to your archived list and leaves the Challenges screen.`,
  )
  if (ok) archiveChallenge(challenge.id)
}
</script>

<template>
  <main class="screen">
    <header class="screen-header">
      <h1 class="screen-title">Settings</h1>
    </header>

    <form class="add" @submit.prevent="add">
      <input
        v-model="newName"
        class="input"
        type="text"
        placeholder="Name a new challenge"
        aria-label="New challenge name"
      />
      <button type="submit" class="btn btn-primary">
        <AppIcon name="plus" :size="18" :sw="2.6" />
        Add
      </button>
    </form>

    <ul v-if="activeChallenges.length > 0" class="list">
      <li v-for="challenge in activeChallenges" :key="challenge.id" class="item">
        <input
          class="input rename"
          :value="challenge.name"
          aria-label="Challenge name"
          @change="commitRename(challenge, $event)"
        />
        <button type="button" class="btn btn-ghost btn-sm" @click="archive(challenge)">
          Archive
        </button>
      </li>
    </ul>
    <p v-else class="empty-text">Add a challenge above to start tracking.</p>

    <section v-if="archivedChallenges.length > 0" class="archived">
      <div class="eyebrow">Archived</div>
      <ul class="list">
        <li v-for="challenge in archivedChallenges" :key="challenge.id" class="archived-item">
          {{ challenge.name }}
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.add {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
}

.add .input {
  flex: 1;
  min-width: 0;
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.rename {
  flex: 1;
  min-width: 0;
  font-weight: var(--fw-bold);
}

.empty-text {
  color: var(--fg-muted);
}

.archived {
  margin-top: 32px;
}

.archived .eyebrow {
  margin-bottom: 10px;
  color: var(--fg-subtle);
}

.archived-item {
  padding: 12px 16px;
  border-radius: var(--r-md);
  background: var(--cream-200);
  color: var(--fg-muted);
  font-weight: var(--fw-semi);
}
</style>
