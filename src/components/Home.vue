<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { gameState } from '../store'

const router = useRouter()
const categories = ref([])
const allOthers = ref([])
const dailyCat = ref(null)
const otherIndex = ref(0)
const loading = ref(false)
const errorMsg = ref('')

const categoryIcons = {
  'Ülkeler': '🌍',
  'Bilgisayar Mühendisliği': '⚙️',
  'Yazılım': '💻',
  'Fizik': '⚛️',
  'Yapay Zeka': '🧠',
  'Genel Kültür': '📚'
}

const categoryThemes = {
  'Ülkeler': { border: '#f59e0b', shadow: 'rgba(245, 158, 11, 0.15)', text: '#d97706' },
  'Bilgisayar Mühendisliği': { border: '#f97316', shadow: 'rgba(249, 115, 22, 0.15)', text: '#c2410c' },
  'Yazılım': { border: '#6366f1', shadow: 'rgba(99, 102, 241, 0.15)', text: '#4338ca' },
  'Fizik': { border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.15)', text: '#be185d' },
  'Yapay Zeka': { border: '#14b8a6', shadow: 'rgba(20, 184, 166, 0.15)', text: '#0f766e' },
  'Genel Kültür': { border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.15)', text: '#6d28d9' }
}

const getTheme = (name) => {
  return categoryThemes[name] || { border: '#cbd5e1', shadow: 'rgba(0,0,0,0.05)', text: '#475569' }
}

onMounted(async () => {
  try {
    const data = await api.getCategories()
    dailyCat.value = data.find(c => c.is_daily_challenge) || null
    allOthers.value = data.filter(c => !c.is_daily_challenge)
    updateDisplay()
  } catch (err) {
    console.error(err)
    errorMsg.value = "Kategoriler yüklenirken hata oluştu."
  }
})

const shuffleCategories = () => {
  if (allOthers.value.length === 0) return
  otherIndex.value = (otherIndex.value + 3) % allOthers.value.length
  updateDisplay()
}

const updateDisplay = () => {
  let toShow = []
  if (allOthers.value.length > 0) {
    for(let i=0; i<3; i++) {
        toShow.push(allOthers.value[(otherIndex.value + i) % allOthers.value.length])
    }
    toShow = [...new Set(toShow)]
  }
  
  let combined = []
  if (dailyCat.value) combined.push(dailyCat.value)
  categories.value = combined.concat(toShow)
}

const startGame = async (categoryId) => {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await api.startGame(categoryId)
    
    gameState.token = data.token
    gameState.questions = data.questions
    gameState.finalScore = 0
    
    router.push('/quiz')
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="home-container animate-fade-in">
    <div class="header">
      <h1>Rapid Quiz</h1>
      <p>Bir kategori seç, 20 soruda ne kadar hızlısın gör.</p>
    </div>

    <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
    <div v-if="categories.length === 0 && !errorMsg" class="loading">Yükleniyor...</div>

    <div v-else class="category-grid">
      <div 
        v-for="cat in categories" 
        :key="cat.id" 
        class="category-card"
        :class="{ 'daily-card': cat.is_daily_challenge }"
        :style="{ 
          '--card-border': cat.is_daily_challenge ? '#fbbf24' : getTheme(cat.name).border, 
          '--card-shadow': cat.is_daily_challenge ? 'rgba(251, 191, 36, 0.2)' : getTheme(cat.name).shadow,
          '--card-text': cat.is_daily_challenge ? '#b45309' : getTheme(cat.name).text 
        }"
        @click="!loading && startGame(cat.id)"
      >
        <div v-if="cat.is_daily_challenge" class="daily-badge">🌟 Günün Kategorisi</div>
        <div class="cat-icon">{{ categoryIcons[cat.name] || '📌' }}</div>
        <h3 class="cat-title">{{ cat.name }}</h3>
        <p class="cat-desc">{{ cat.is_daily_challenge ? 'Herkes aynı 20 soruyu çözer' : 'Hemen test et' }}</p>
        <span class="badge" :style="{ color: cat.is_daily_challenge ? '#b45309' : getTheme(cat.name).text, backgroundColor: cat.is_daily_challenge ? '#fef3c7' : getTheme(cat.name).shadow }">
          {{ cat.is_daily_challenge ? 'Özel Etkinlik' : 'Hızlı Test' }}
        </span>
      </div>
    </div>

    <div v-if="allOthers.length > 3" class="shuffle-container">
      <button @click="shuffleCategories" class="btn-shuffle">
        🔄 Başka Kategoriler Getir
      </button>
    </div>

    <div class="footer-link">
      <button @click="router.push('/leaderboard')" class="btn-text">Skor Tablosu ➔</button>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.header {
  margin-bottom: 4rem;
}

.header h1 {
  font-size: 3.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4f46e5 0%, #ec4899 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}

.header p {
  color: #334155;
  font-size: 1.2rem;
  font-weight: 500;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.category-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 2rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: 0 10px 25px -5px var(--card-shadow), 0 8px 10px -6px var(--card-shadow);
  border: 2px solid var(--card-border);
}

.category-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 35px -5px var(--card-shadow), 0 15px 15px -10px var(--card-shadow);
}

.daily-card {
  border-width: 3px;
  background: linear-gradient(to bottom right, #ffffff, #fffbeb);
}

.daily-badge {
  position: absolute;
  top: -15px;
  right: -15px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 800;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(245, 158, 11, 0.4);
  transform: rotate(5deg);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: rotate(5deg) scale(1); }
  50% { transform: rotate(5deg) scale(1.05); }
  100% { transform: rotate(5deg) scale(1); }
}

.cat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.cat-title {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #0f172a;
}

.cat-desc {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 2rem;
}

.badge {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.shuffle-container {
  margin-bottom: 2rem;
}

.btn-shuffle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 14px 32px;
  border-radius: 30px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-shuffle:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.6);
}

.footer-link {
  margin-top: 3rem;
}

.btn-text {
  background: white;
  border: 2px solid #e2e8f0;
  color: #4f46e5;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 12px 30px;
  border-radius: 30px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
}

.btn-text:hover {
  border-color: #4f46e5;
  background: #f5f3ff;
  transform: translateY(-2px);
}

.error-msg {
  color: var(--danger);
  padding: 1rem;
  background: #fee2e2;
  border-radius: 8px;
  margin-bottom: 2rem;
}
</style>
