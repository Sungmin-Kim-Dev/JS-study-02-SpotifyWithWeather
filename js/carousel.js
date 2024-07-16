document.addEventListener('DOMContentLoaded', () => {
  console.log('carousel.js');
  document.querySelectorAll('.carousel').forEach((carousel) => {
    const trackList = [
      '.search-track',
      '.search-album',
      '.search-artist',
      '.search-playlist',
    ];

    trackList.forEach((trackSelector) => {
      const track = carousel.querySelector(trackSelector);
      if (!track) return;

      const slides = track.querySelectorAll(`${trackSelector}-list`);
      const nextButton = carousel.querySelector('.next-button');
      const prevButton = carousel.querySelector('.prev-button');

      if (slides.length === 0) return;

      let currentIndex = 0;

      const updateSlidePosition = () => {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      };

      nextButton.addEventListener('click', () => {
        console.log('next button');
        if (currentIndex < slides.length - 5) {
          currentIndex++;
        } else {
          currentIndex = 0;
        }
        updateSlidePosition();
      });

      prevButton.addEventListener('click', () => {
        console.log('prev button');
        if (currentIndex > 0) {
          currentIndex--;
        } else {
          currentIndex = slides.length - 5;
        }
        updateSlidePosition();
      });
    });
  });
});
