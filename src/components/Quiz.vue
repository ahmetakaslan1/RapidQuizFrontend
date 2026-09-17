<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../services/api'
import { gameState } from '../store'

const router = useRouter()

const currentIndex = ref(0)
const currentScore = ref(0)
const timeLeftPercentage = ref(100)
const isAnswering = ref(false)
const selectedOption = ref(null)
const correctOption = ref(null)

let startTime = 0
let animationFrameId = null
const TIME_LIMIT_MS = 9000

const currentQuestion = computed(() => {
  return gameState.questions[currentIndex.value]
})

onMounted(() => {
  if (!gameState.token || gameState.questions.length === 0) {
    router.push('/')
    return
  }
  startTimer()
})

onUnmounted(() => {
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})

const startTimer = () => {
  isAnswering.value = false
  selectedOption.value = null
  correctOption.value = null
  timeLeftPercentage.value = 100
  startTime = performance.now()
  
  const updateTimer = (currentTime) => {
    const elapsed = currentTime - startTime
    const remaining = Math.max(TIME_LIMIT_MS - elapsed, 0)
    timeLeftPercentage.value = (remaining / TIME_LIMIT_MS) * 100
    
    if (remaining > 0) {
      animationFrameId = requestAnimationFrame(updateTimer)
    } else {
      // Timeout!
      handleAnswer('TIMEOUT', TIME_LIMIT_MS)
    }
  }
  animationFrameId = requestAnimationFrame(updateTimer)
}

const selectOption = (optStr) => {
  if (isAnswering.value) return
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
  
  const action_ms = Math.round(performance.now() - startTime)
  handleAnswer(optStr, action_ms)
}

const handleAnswer = async (opt, ms) => {
  isAnswering.value = true
  selectedOption.value = opt
  
  try {
    const res = await api.submitAnswer(gameState.token, currentQuestion.value.id, opt, ms)
    correctOption.value = res.correct_option
    currentScore.value = res.current_score
  } catch (e) {
    console.error('Answer submission failed', e)
    // Fallback if API fails, still need to show something or abort
    alert(e.message)
    router.push('/')
    return
  }
  
  // Wait 1.5 seconds, then next question
  setTimeout(() => {
    nextQuestion()
  }, 1500)
}

const nextQuestion = () => {
  if (currentIndex.value < gameState.questions.length - 1) {
    currentIndex.value++
    startTimer()
  } else {
    // Game over
    gameState.finalScore = currentScore.value
    router.push('/score')
  }
}

const getOptionClass = (optStr) => {
  if (!isAnswering.value) return 'opt-idle'
  
  // During answering phase
  if (correctOption.value === optStr) return 'opt-correct'
  if (selectedOption.value === optStr) return 'opt-wrong'
  
  return 'opt-disabled'
}
</script>

<template>
  <div class="glass-panel animate-fade-in quiz-panel" :class="{'tension-active': timeLeftPercentage < 33.3 && !isAnswering}" v-if="currentQuestion">
    <div class="header">
      <span class="question-count">Soru {{ currentIndex + 1 }} / {{ gameState.questions.length }}</span>
      <span class="score">Puan: {{ currentScore }}</span>
    </div>
    
    <div class="timer-bar-bg">
      <div class="timer-bar-fill" :style="{ width: timeLeftPercentage + '%' }"></div>
    </div>
    
    <h2 class="question-text">{{ currentQuestion.text }}</h2>
    
    <div class="options-grid">
      <button 
        @click="selectOption('A')" 
        class="option-btn" 
        :class="getOptionClass('A')"
        :disabled="isAnswering"
      >
        <span class="opt-label">A</span> {{ currentQuestion.option_a }}
      </button>
      
      <button 
        @click="selectOption('B')" 
        class="option-btn" 
        :class="getOptionClass('B')"
        :disabled="isAnswering"
      >
        <span class="opt-label">B</span> {{ currentQuestion.option_b }}
      </button>
      
      <button 
        @click="selectOption('C')" 
        class="option-btn" 
        :class="getOptionClass('C')"
        :disabled="isAnswering"
      >
        <span class="opt-label">C</span> {{ currentQuestion.option_c }}
      </button>
      
      <button 
        @click="selectOption('D')" 
        class="option-btn" 
        :class="getOptionClass('D')"
        :disabled="isAnswering"
      >
        <span class="opt-label">D</span> {{ currentQuestion.option_d }}
      </button>
    </div>
    
    <div class="timeout-msg" :class="{'visible': selectedOption === 'TIMEOUT'}">
      SÜRE BİTTİ!
    </div>
  </div>
</template>

<style scoped>
.quiz-panel {
  padding: 2.5rem;
  width: 100%;
  max-width: 700px;
}

@media (max-width: 600px) {
  .quiz-panel {
    padding: 1.5rem;
  }
  .options-grid {
    gap: 0.75rem;
  }
  .option-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  font-weight: 700;
  color: #64748b;
}
.score {
  color: #4f46e5;
  font-size: 1.2rem;
}
.timer-bar-bg {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 2rem;
}
.timer-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent) 0%, var(--primary) 100%);
  box-shadow: 0 0 10px var(--primary-glow);
  /* Use linear transition for smooth shrinking */
  transition: width 0.05s linear; 
}
.question-text {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  line-height: 1.4;
  color: #1e293b;
  font-weight: 700;
}
.options-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.option-btn {
  text-align: left;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-family: var(--font-sans);
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  background: white;
  color: #1f2937;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.opt-label {
  background: #f1f5f9;
  color: #475569;
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  margin-right: 1rem;
  font-weight: bold;
}

/* Option States */
.opt-idle:hover {
  background: #f8fafc;
  transform: translateX(5px);
  border-color: #cbd5e1;
}
.opt-correct {
  background: var(--success);
  border-color: var(--success);
  box-shadow: 0 0 20px var(--success-glow);
  color: white;
  z-index: 2;
}
.opt-wrong {
  background: var(--danger);
  border-color: var(--danger);
  box-shadow: 0 0 20px var(--danger-glow);
  animation: shake 0.4s;
}
.opt-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.timeout-msg {
  text-align: center;
  margin-top: 1.5rem;
  color: var(--danger);
  font-weight: bold;
  font-size: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s;
}
.timeout-msg.visible {
  opacity: 1;
}

@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}

/* Visual Tension Effects */
.tension-active {
  animation: pulse-red 1s infinite alternate, tension-shake 0.5s infinite;
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
  border-color: rgba(239, 68, 68, 0.5);
}
.tension-active .timer-bar-fill {
  background: var(--danger);
  box-shadow: 0 0 15px var(--danger-glow);
}

@keyframes pulse-red {
  from { box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
  to { box-shadow: 0 0 40px rgba(239, 68, 68, 0.6); }
}
@keyframes tension-shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  25% { transform: translate(-1px, -2px) rotate(-1deg); }
  50% { transform: translate(-2px, 0px) rotate(1deg); }
  75% { transform: translate(2px, 1px) rotate(0deg); }
  100% { transform: translate(1px, -1px) rotate(-1deg); }
}
</style>
