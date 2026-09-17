<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'

const router = useRouter()
const scores = ref([])
const categories = ref([])
const activeCategory = ref('') // empty means 'Genel'
const loading = ref(true)

const loadScores = async () => {
  loading.value = true
  try {
    scores.value = await api.getLeaderboard(activeCategory.value)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    categories.value = await api.getCategories()
    await loadScores()
  } catch (e) {
    console.error(e)
    loading.value = false
  }
})

watch(activeCategory, () => {
  loadScores()
})

const getRankMedal = (index) => {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `${index + 1}.`
}
</script>

<template>
  <div class="leaderboard-panel animate-fade-in">
    <h1>Skor Tablosu</h1>
    
    <div class="pills-container">
      <button 
        class="pill" 
        :class="{ active: activeCategory === '' }"
        @click="activeCategory = ''"
      >
        Genel
      </button>
      <button 
        v-for="cat in categories" 
        :key="cat.id"
        class="pill"
        :class="{ active: activeCategory === cat.id }"
        @click="activeCategory = cat.id"
      >
        {{ cat.name }}
      </button>
    </div>

    <div v-if="loading" class="loading">Yükleniyor...</div>
    
    <div v-else class="content">
      <div v-if="scores.length === 0" class="empty-state">
        Henüz skor yok. İlk giren sen ol!
      </div>
      
      <div v-else class="table-container">
        <table class="leaderboard-table">
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Oyuncu</th>
              <th>Kategori</th>
              <th class="text-right">Puan</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(s, index) in scores" :key="index" :class="{'top-3': index < 3}">
              <td class="rank-col">{{ getRankMedal(index) }}</td>
              <td class="name-col">{{ s.username }}</td>
              <td class="category-col">{{ s.category }}</td>
              <td class="score-col">{{ s.score }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <div class="footer-link">
      <button @click="router.push('/')" class="btn-text mt-4">Geri Dön</button>
    </div>
  </div>
</template>

<style scoped>
.leaderboard-panel {
  padding: 2.5rem;
  width: 100%;
  max-width: 800px;
  text-align: center;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

@media (max-width: 600px) {
  .leaderboard-panel {
    padding: 1.5rem;
  }
}

h1 {
  font-size: 2.5rem;
  color: #1f2937;
  margin-bottom: 2rem;
}

.pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.pill {
  background: #f3f4f6;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pill:hover {
  background: #e5e7eb;
}

.pill.active {
  background: #3b82f6;
  color: white;
}

.table-container {
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
}

.leaderboard-table {
  width: 100%;
  border-collapse: collapse;
}

.leaderboard-table th,
.leaderboard-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.leaderboard-table th {
  color: #6b7280;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-align: left;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.leaderboard-table td {
  text-align: left;
  font-size: 1.1rem;
  color: #374151;
}

.rank-col {
  width: 60px;
  font-size: 1.3rem !important;
  font-weight: bold;
}

.category-col {
  font-size: 0.9rem !important;
  color: #6b7280 !important;
}

.score-col {
  text-align: right !important;
  color: #1f2937;
  font-weight: 800 !important;
}

.text-right {
  text-align: right !important;
}

.top-3:nth-child(1) .name-col { color: #d97706; font-weight: bold; }
.top-3:nth-child(2) .name-col { color: #6b7280; font-weight: bold; }
.top-3:nth-child(3) .name-col { color: #92400e; font-weight: bold; }

.loading, .empty-state {
  margin: 3rem 0;
  color: #6b7280;
}

.footer-link {
  margin-top: 2rem;
}

.btn-text {
  background: transparent;
  border: none;
  color: #4338ca;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  transition: opacity 0.2s;
}

.btn-text:hover {
  opacity: 0.8;
}

.table-container::-webkit-scrollbar { width: 6px; }
.table-container::-webkit-scrollbar-track { background: #f3f4f6; }
.table-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
</style>
