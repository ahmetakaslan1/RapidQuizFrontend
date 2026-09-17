<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { gameState } from '../store'

const router = useRouter()
const username = ref('')
const websiteUrl = ref('') // Honey Pot!
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

onMounted(() => {
  // If user came here without playing (no token or score), redirect home
  if (!gameState.token) {
    router.push('/')
  }
})

const submitScore = async () => {
  if (!username.value.trim()) {
    errorMsg.value = 'Lütfen adınızı girin.'
    return
  }
  
  loading.value = true
  errorMsg.value = ''
  
  try {
    await api.submitScore(gameState.token, username.value, websiteUrl.value)
    successMsg.value = 'Tebrikler! Skorunuz Liderlik Tablosuna eklendi.'
    // Clear token so they can't submit again
    gameState.token = ''
  } catch(e) {
    errorMsg.value = e.message || 'Skor kaydedilemedi.'
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  gameState.token = ''
  gameState.questions = []
  gameState.finalScore = 0
  router.push('/')
}
</script>

<template>
  <div class="glass-panel animate-fade-in score-panel">
    <div class="trophy">🏆</div>
    <h1>Oyun Bitti!</h1>
    
    <div class="score-display">
      <span class="score-label">Toplam Puan</span>
      <span class="score-value">{{ gameState.finalScore }}</span>
    </div>
    
    <div v-if="successMsg" class="success-box">
      {{ successMsg }}
      <br><br>
      <button @click="router.push('/leaderboard')" class="btn-primary w-full">🏆 Liderlik Tablosunu Gör</button>
      <button @click="goHome" class="btn-text mt-4">Ana Sayfaya Dön</button>
    </div>
    
    <div v-else class="form-section">
      <p class="desc">Zirvedeki yerini almak için adını yaz!</p>
      
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      
      <div class="input-group">
        <input 
          type="text" 
          v-model="username" 
          placeholder="Kullanıcı Adı" 
          class="modern-input"
          @keyup.enter="submitScore"
        >
      </div>
      
      <!-- Honey Pot Field: visually hidden but bot-accessible -->
      <div class="hp-wrapper" aria-hidden="true">
        <label for="website_url">Website (Boş bırakın)</label>
        <input type="text" id="website_url" v-model="websiteUrl" tabindex="-1" autocomplete="off">
      </div>
      
      <button @click="submitScore" class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Kaydediliyor...' : 'Skorumu Kaydet' }}
      </button>
      
      <button @click="goHome" class="btn-text mt-4">Kaydetmeden Çık</button>
      <button @click="router.push('/leaderboard')" class="btn-text mt-4" style="margin-left: 1rem;">Liderlik Tablosu</button>
    </div>
  </div>
</template>

<style scoped>
.score-panel {
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  text-align: center;
}

@media (max-width: 600px) {
  .score-panel {
    padding: 1.5rem;
  }
  .score-display {
    padding: 1rem;
  }
  .score-value {
    font-size: 2.5rem;
  }
}
.trophy {
  font-size: 4rem;
  margin-bottom: 1rem;
}
.score-panel h1 {
  color: #1e293b;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}
.score-display {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.5rem;
  margin: 2rem 0;
  border: 1px solid #e2e8f0;
}
.score-label {
  display: block;
  font-size: 1rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}
.score-value {
  display: block;
  font-size: 3.5rem;
  font-weight: 800;
  font-family: var(--font-display);
  color: #10b981;
}
.desc {
  color: #475569;
  font-weight: 500;
  margin-bottom: 1.5rem;
}
.modern-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #1f2937;
  font-family: var(--font-sans);
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
  margin-bottom: 1.5rem;
}
.modern-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 10px var(--primary-glow);
}
.w-full {
  width: 100%;
}
.mt-4 {
  margin-top: 1rem;
}
.btn-text {
  background: transparent;
  border: none;
  color: var(--primary);
  cursor: pointer;
  font-size: 1rem;
  text-decoration: underline;
  transition: color 0.2s;
}
.btn-text:hover {
  color: var(--primary-hover);
}
.error-msg {
  color: var(--danger);
  margin-bottom: 1rem;
  padding: 10px;
  background: var(--danger-glow);
  border-radius: 8px;
  font-size: 0.9rem;
}
.success-box {
  color: var(--success);
  padding: 20px;
  background: var(--success-glow);
  border-radius: 12px;
  font-weight: 600;
  border: 1px solid var(--success);
}

/* Honey Pot Styling: Hidden from humans, visible to bots */
.hp-wrapper {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 0;
  width: 0;
  z-index: -1;
  overflow: hidden;
}
</style>
