import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/onward-tokens.css'
import './assets/main.css'
import App from './App.vue'
import ChallengeListView from './views/ChallengeListView.vue'
import ReportsView from './views/ReportsView.vue'
import ChallengeReportView from './views/ChallengeReportView.vue'
import SettingsView from './views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'challenges',
      component: ChallengeListView,
    },
    {
      path: '/reports',
      name: 'reports',
      component: ReportsView,
    },
    {
      path: '/reports/:id',
      name: 'challenge-report',
      component: ChallengeReportView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
  ],
})

const app = createApp(App)

app.use(router)

app.mount('#app')
