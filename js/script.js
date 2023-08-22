const citySelect = document.querySelector('#city');
const cityChoices = new Choices(citySelect, {
  searchEnabled: false,
  itemSelectText: '',
});

const cards = document.querySelectorAll('.vacancy');
const modal = document.querySelector('.modal');

cards.forEach((card) => {
  card.addEventListener('click', () => {
    modal.style.display = 'block';
  });
});

modal.addEventListener('click', ({target}) => {
  if (target === modal || target.closest('.modal__close')) {
    modal.style.display = 'none';
  }
});