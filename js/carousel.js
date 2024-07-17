console.log('carousel.js');

document.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('next-button')) {
      console.log('next');
    } else if (e.target.classList.contains('prev-button')) {
      console.log('prev');
    }
  });
});
