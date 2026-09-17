import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Quiz from '../components/Quiz.vue'
import Score from '../components/Score.vue'
import Leaderboard from '../components/Leaderboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: Quiz,
    props: true
  },
  {
    path: '/score',
    name: 'Score',
    component: Score,
    props: true
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: Leaderboard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
