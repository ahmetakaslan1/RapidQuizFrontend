import { reactive } from 'vue';

export const gameState = reactive({
  token: '',
  questions: [],
  finalScore: 0
});
