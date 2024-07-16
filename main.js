// main.js

import { callSpotifyAPI as callSearchSpotifyAPI } from './js/search.js';
import { getWeatherInfo } from './js/weather.js';

document.addEventListener('DOMContentLoaded', () => {
  const weatherMenuBtn = document.querySelector('.weather-menu-btn');
  if (weatherMenuBtn) {
    weatherMenuBtn.addEventListener('click', getWeatherInfo);
  }

  const searchForm = document.querySelector('form');
  searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value;
    if (query) {
      await callSearchSpotifyAPI(query);
    } else {
      console.error('Search query is empty');
    }
    searchInput.value = '';
  });
});
