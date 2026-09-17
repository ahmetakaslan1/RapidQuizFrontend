const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  async getCategories() {
    const res = await fetch(`${API_URL}/categories/`);
    if (!res.ok) throw new Error('Network error');
    return res.json();
  },

  async startGame(categoryId) {
    const res = await fetch(`${API_URL}/start-game/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category_id: categoryId })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to start game');
    }
    return res.json(); // { token, questions }
  },

  async submitAnswer(token, questionId, selectedOption, ms) {
    const res = await fetch(`${API_URL}/submit-answer/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        question_id: questionId,
        selected_option: selectedOption,
        islem_yapilan_milisaniye: ms
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit answer');
    }
    return res.json(); // { status, points_awarded, current_score, correct_option }
  },

  async submitScore(token, username, websiteUrl = '') {
    const res = await fetch(`${API_URL}/submit-score/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        username: username,
        website_url: websiteUrl
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit score');
    }
    return res.json();
  },

  async getLeaderboard(categoryId = null) {
    const query = categoryId ? `?category_id=${categoryId}` : '';
    const res = await fetch(`${API_URL}/leaderboard/${query}`);
    if (!res.ok) throw new Error('Network error fetching leaderboard');
    return res.json();
  }
};
