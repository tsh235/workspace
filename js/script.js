const API_URL = 'https://unique-citrine-silicon.glitch.me/';
const LOCATION_URL = 'api/locations';
const VACANCY_URL = 'api/vacancy';

const cardsList = document.querySelector('.cards__list');
let lastUrl = '';
const pagination = {};


const getData = async (url, cbSuccess, cbError) => {
  try{
    const response = await fetch(url);
    const data = await response.json();
    cbSuccess(data);
  } catch (err) {
    cbError(err);
  }
};

const createCard = vacancy => `
  <article class="vacancy" tabindex="0" data-id="${vacancy.id}">
    <img class="vacancy__img" src="${API_URL}${vacancy.logo}" alt="Логотип компании ${vacancy.company}">
    <p class="vacancy__company">${vacancy.company}</p>
    <h3 class="vacancy__title">${vacancy.title}</h3>

    <ul class="vacancy__fields">
      <li class="vacancy__field">от ${parseInt(vacancy.salary).toLocaleString()} ₽</li>
      <li class="vacancy__field">${vacancy.type}</li>
      <li class="vacancy__field">${vacancy.format}</li>
      <li class="vacancy__field">${vacancy.experience}</li>
    </ul>
  </article>
`;

const inputNumberController = () => {
  const inputNumberElems = document.querySelectorAll('input[type="number"]');
  inputNumberElems.forEach(input => {
    let value = '';
    input.addEventListener('input', (event) => {
      if (isNaN(parseInt(event.data)) && event.data !== null) {
        event.target.value = value;
      }
      value = event.target.value;
    });
  });
};

const createCards = (data) => 
  data.vacancies.map(vacancy => {
    const li = document.createElement('li');
    li.classList.add('cards__item');
    li.insertAdjacentHTML('beforeend', createCard(vacancy));
    return li;
  });

const renderVacancies = (data) => {
  cardsList.textContent = '';
  const cards = createCards(data);
  cardsList.append(...cards);
  
  if (data.pagination) {
    Object.assign(pagination, data.pagination)
  }

  observer.observe(cardsList.lastElementChild);
};

const renderMoreVacancies = (data) => {
  const cards = createCards(data);
  cardsList.append(...cards);
  
  if (data.pagination) {
    Object.assign(pagination, data.pagination)
  }

  observer.observe(cardsList.lastElementChild);
};

const loadMoreVacancies = () => {
  if (pagination.totalPages > pagination.currentPage) {
    const urlWithParams = new URL(lastUrl);
    urlWithParams.searchParams.set('page', pagination.currentPage + 1);
    urlWithParams.searchParams.set('limit', window.innerWidth < 768 ? 6 : 12);

    getData(urlWithParams, renderMoreVacancies, renderError).then(() => {
      lastUrl = urlWithParams;
    });
  }
};

const renderError = err => {
  console.warn(err);
};

const createDetailVacancy = (data) => `
  <article class="detail">
  <div class="detail__head">
    <img class="detail__logo" src="${API_URL}${data.logo}" alt="Логотип компании ${data.company}">
    <p class="detail__company">${data.company}</p>
    <h2 class="detail__title">${data.title}</h2>
  </div>
  <div class="detail__body">
    <p class="detail__description">${data.description.replaceAll('\n', '<br>')}</p>
    <ul class="detail__fields">
      <li class="detail__field">от ${parseInt(data.salary).toLocaleString()} ₽</li>
      <li class="detail__field">${data.type}</li>
      <li class="detail__field">${data.format}</li>
      <li class="detail__field">${data.experience}</li>
      <li class="detail__field">${data.location}</li>
    </ul>
  </div>
  <p class="detail__resume">Отправляйте резюме на <a class="detail__link blue-text" href="mailto:${data.email}">${data.email}</a></p>
  </article>
`;

// Modal

const renderModal = data => {
  const modal = document.createElement('div');
  modal.classList.add('modal');
  const modalBody = document.createElement('div');
  modalBody.classList.add('modal__body');
  modalBody.innerHTML = createDetailVacancy(data);
  const modalClose = document.createElement('button');
  modalClose.classList.add('modal__close');
  modalClose.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.7831 10L15.3887 5.39444C15.4797 5.28816 15.5272 5.15145 15.5218 5.01163C15.5164 4.87181 15.4585 4.73918 15.3595 4.64024C15.2606 4.5413 15.128 4.48334 14.9881 4.47794C14.8483 4.47254 14.7116 4.52009 14.6053 4.61111L9.99977 9.21666L5.39421 4.60555C5.2896 4.50094 5.14771 4.44217 4.99977 4.44217C4.85182 4.44217 4.70994 4.50094 4.60532 4.60555C4.50071 4.71017 4.44194 4.85205 4.44194 5C4.44194 5.14794 4.50071 5.28983 4.60532 5.39444L9.21643 10L4.60532 14.6056C4.54717 14.6554 4.49993 14.7166 4.46659 14.7856C4.43324 14.8545 4.4145 14.9296 4.41155 15.0061C4.40859 15.0826 4.42148 15.1589 4.44941 15.2302C4.47734 15.3015 4.51971 15.3662 4.57385 15.4204C4.62799 15.4745 4.69274 15.5169 4.76403 15.5448C4.83532 15.5727 4.91162 15.5856 4.98813 15.5827C5.06464 15.5797 5.13972 15.561 5.20864 15.5276C5.27757 15.4943 5.33885 15.447 5.38866 15.3889L9.99977 10.7833L14.6053 15.3889C14.7116 15.4799 14.8483 15.5275 14.9881 15.5221C15.128 15.5167 15.2606 15.4587 15.3595 15.3598C15.4585 15.2608 15.5164 15.1282 15.5218 14.9884C15.5272 14.8485 15.4797 14.7118 15.3887 14.6056L10.7831 10Z" fill="currentColor"/>
    </svg>
  `;
  modalBody.append(modalClose);
  modal.append(modalBody);
  document.body.append(modal);

  modal.addEventListener('click', ({target}) => {
    if (target === modal || target.closest('.modal__close')) {
      modal.remove();
    }
  });
};

const openModal = (id) => {
  getData(`${API_URL}${VACANCY_URL}/${id}`, renderModal, renderError);
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        loadMoreVacancies();
      }
    });
  }, 
  {
    rootMargin: '100px',
  }
);

// Open filter
const openFilter = () => {
  const openFilterBtn = document.querySelector('.vacancies__filter-btn');
  const vacanciesFilter = document.querySelector('.vacancies__filter');

  if (openFilterBtn) {
    openFilterBtn.addEventListener('click', () => {
      vacanciesFilter.classList.toggle('vacancies__filter--active');
      openFilterBtn.classList.toggle('vacancies__filter-btn--active');
    });
  }
};

const init = () => {
  try {
    const filterForm = document.querySelector('.filter__form');

    // Select City
    const citySelect = document.querySelector('#city');
    const cityChoices = new Choices(citySelect, {
      searchEnabled: false, // если убрать строку, то в селекте можно будет искать по городам
      itemSelectText: '',
    });

    getData(
      `${API_URL}${LOCATION_URL}`, 
      (locationData) => {
        const locations = locationData.map(location => ({
          value: location,
        }));

        cityChoices.setChoices(
          locations,
          'value',
          'label',
          false,  // если здесь поставить true, то города с api будут заменять те, которые в html в option прописаны
        );

        filterForm.addEventListener('reset', () => {
          if (!cityChoices.config.searchEnabled) { // проверем есть ли поле для ввода города
            cityChoices.removeActiveItems();
            cityChoices.setChoiceByValue('');
          } else {
            placeholderItem = cityChoices._getTemplate( 'placeholder', 'Выбрать город' );
            cityChoices.itemList.append(placeholderItem);
            cityChoices.setChoices(
              locations,
              'value',
              'label',
              false,
            );
          }
          
          // после очистки формы рендерим заново полный список вакансий
          getData(urlWithParams, renderVacancies, renderError).then(() => {
            lastUrl = urlWithParams;
          });
        });
      }, 
      (err) => {
        console.log(err)
      }
    );

    // Cards
    const urlWithParams = new URL(`${API_URL}${VACANCY_URL}`);

    urlWithParams.searchParams.set('limit', window.innerWidth < 768 ? 6 : 12);
    urlWithParams.searchParams.set('page', 1);

    getData(urlWithParams, renderVacancies, renderError).then(() => {
      lastUrl = urlWithParams;
    });

    cardsList.addEventListener('click', ({target}) => {
      const vacancyCard = target.closest('.vacancy');
      if (vacancyCard) {
        const vacancyId = vacancyCard.dataset.id;
        openModal(vacancyId);
      }
    });

    cardsList.addEventListener('keydown', ({code, target}) => {
      const vacancyCard = target.closest('.vacancy');
      if ((code === 'Enter' || code === 'NumpadEnter') && vacancyCard) {
        const vacancyId = vacancyCard.dataset.id;
        openModal(vacancyId);
        target(blur);
      } 
    });

    openFilter();

    // Filter
    filterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(filterForm);

      const urlWithParams = new URL(`${API_URL}${VACANCY_URL}`);

      formData.forEach((value, key) => {
        urlWithParams.searchParams.append(key, value);
      });
      
      getData(urlWithParams, renderVacancies, renderError).then(() => {
        lastUrl = urlWithParams;
      });
    });
  } catch {}

  try {
    const validationForm = (form) => {
      const validate = new JustValidate(form, {
        errorLabelStyle: {color: '#f00',},
        errorFieldStyle: {borderColor: '#f00',},
        errorFieldCssClass: ['invalid'],
        tooltip: {
          position: 'top',
        }
      });

      validate
        .addField('#logo', [
          {
            rule: 'minFilesCount',
            value: 1,
            errorMessage: 'Добавьте логотип',
          },
          {
            rule: 'files',
            value: {
              files: {
                extensions: ['jpeg', 'png', 'jpg'],
                maxSize: 102400,
                minSize: 1000,
                types: ['image/jpeg', 'image/png'],
              },
            },
            errorMessage: 'Размер файла должен быть не больше 100Кб',
          }
        ])
        .addField('#company', [
          {
            rule: 'required',
            errorMessage: 'Заполните название компании',
          }
        ])
        .addField('#title', [
          {
            rule: 'required', 
            errorMessage: 'Заполните название вакансии',
          }
        ])
        .addField('#salary', [
          {
            rule: 'required', 
            errorMessage: 'Заполните заработную плату',
          }
        ])
        .addField('#location', [
          {
            rule: 'required', 
            errorMessage: 'Заполните город',
          }
        ])
        .addField('#email', [
          {
            rule: 'required',
            errorMessage: 'Введите email',
          },
          {
            rule: 'email',
            errorMessage: 'Введите корректный email',
          }
        ])
        .addField('#description', [
          {
            rule: 'required', 
            errorMessage: 'Заполните описание вакансии',
          }
        ])
        .addRequiredGroup('#fotmat', 'Выберите формат')
        .addRequiredGroup('#experience', 'Выберите опыт')
        .addRequiredGroup('#type', 'Выберите занятость');

      return validate;
    };

    const fileController = () => {
      const file = document.querySelector('.file');
      const preview = file.querySelector('.file__preview');
      const input = file.querySelector('.file__input');

      input.addEventListener('change', (event) => {
        console.log(event.target.files);
        if (event.target.files.length > 0) {
          const src = URL.createObjectURL(event.target.files[0]);
          file.classList.add('file--active');
          preview.src = src;
          preview.style.display = 'block';
        } else {
          file.classList.remove('file--active');
          preview.src = '';
          preview.style.display = 'none';
        }
      });
    };

    const formController = () => {
      const form = document.querySelector('.employer__form');
      const employerError = document.querySelector('.employer__error');
      const validate = validationForm(form);
      
      form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!validate.isValid) {
          employerError.innerHTML = '<p>Заполните все поля корректно</p>';
          return;
        }

        try {
          const formData = new FormData(form);

          employerError.textContent = 'Оптравка вакансии, подождите...';

          const response = await fetch(`${API_URL}${VACANCY_URL}`, {
            method: 'POST',
            body: formData,
          });

          if (response.ok) {
            employerError.textContent = '';
            window.location.href = 'index.html';
          }
        } catch (error) {
          employerError.textContent = 'Произошла ошибка, повторите отправку.';
          console.error(error);
        }
      });
    };
    
    fileController();
    formController();

  } catch {}

  inputNumberController();
};

init();