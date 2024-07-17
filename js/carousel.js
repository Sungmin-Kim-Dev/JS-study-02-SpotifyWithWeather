console.log('carousel.js');

document.addEventListener('DOMContentLoaded', (event) => {
  const nextButtons = document.querySelectorAll('.next-button');
  const prevButtons = document.querySelectorAll('.prev-button');

  nextButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      console.log('next');
      const carousel = e.target.closest('.carousel');
      const track = carousel.querySelector('.carousel-track');
      if (track) {
        const trackWidth = track.getBoundingClientRect().width;
        const currentTranslateX = getTranslateXValue(track);
        const newTranslateX = currentTranslateX - trackWidth / 5; // 항목이 5개씩 보이도록 설정
        track.style.transform = `translateX(${newTranslateX}px)`;
      } else {
        console.error('carousel-track not found');
      }
    });
  });

  prevButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      console.log('prev');
      const carousel = e.target.closest('.carousel');
      const track = carousel.querySelector('.carousel-track');
      if (track) {
        const trackWidth = track.getBoundingClientRect().width;
        const currentTranslateX = getTranslateXValue(track);
        const newTranslateX = currentTranslateX + trackWidth / 5; // 항목이 5개씩 보이도록 설정
        track.style.transform = `translateX(${newTranslateX}px)`;
      } else {
        console.error('carousel-track not found');
      }
    });
  });

  function getTranslateXValue(element) {
    const style = window.getComputedStyle(element);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m41;
  }
});
