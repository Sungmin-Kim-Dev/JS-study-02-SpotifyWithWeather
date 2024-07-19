document
  .querySelector('li:nth-child(1) > button')
  .addEventListener('click', function () {
    window.location.href = 'index.html';
    console.log('index.html');
  });

// 메인 날씨 부분 더보기 클릭
const showTwoLines = (button) => {
  // 클릭된 버튼에서 가장 가까운 .contents-line 요소를 찾습니다.
  const contentsLine = button.closest('.contents-line');
  // 그 안에서 .card-container 요소를 찾습니다.
  const cardContainer = contentsLine.querySelector('.card-container');
  // .card-two-lines 클래스를 추가하거나 제거합니다.
  cardContainer.classList.toggle('card-two-lines');
};
