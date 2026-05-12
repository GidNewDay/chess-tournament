// ===== БЛОК 3: Слайдер участников =====
(function() {
  let currentIndex = 0;
  let slideInterval = null;
  let isMobile = false;
  let totalCards = 6;
  let track = null;
  let slides = [];

  function initBlock3() {
    track = document.getElementById('participantsTrack');
    if (!track) return;

    // Сохраняем оригинальные карточки
    slides = Array.from(track.children);
    totalCards = slides.length;

    buildSlider();
    setupEventListeners();
    startAutoSlide();

    window.addEventListener('resize', () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(() => {
        stopAutoSlide();
        buildSlider();
        startAutoSlide();
      }, 150);
    });
  }

  function buildSlider() {
    const isMobileNow = window.innerWidth < 768;
    const cardsPerView = isMobileNow ? 1 : 3;
    isMobile = isMobileNow;

    // Очищаем трек
    track.innerHTML = '';

    // Добавляем копии последних карточек в начало
    const lastCards = slides.slice(-cardsPerView);
    lastCards.forEach(card => track.appendChild(card.cloneNode(true)));

    // Добавляем оригинальные карточки
    slides.forEach(card => track.appendChild(card.cloneNode(true)));

    // Добавляем копии первых карточек в конец
    const firstCards = slides.slice(0, cardsPerView);
    firstCards.forEach(card => track.appendChild(card.cloneNode(true)));

    // Устанавливаем начальную позицию
    currentIndex = cardsPerView;
    updateSliderPosition(false);
    updateCounter();

    // Обновляем ширину карточек
    updateCardWidths();

    // Навешиваем обработчики на кнопки "Подробнее"
    attachCardButtons();

    // Обновляем навигацию
    updateNavigation();
    updateMobileNav();
  }

  function updateCardWidths() {
    const cards = document.querySelectorAll('.block3__card');
    const container = document.querySelector('.block3__slider');
    if (!container || cards.length === 0) return;

    const containerWidth = container.clientWidth;
    const cardsPerView = isMobile ? 1 : 3;
    const cardWidth = isMobile ? containerWidth : (containerWidth - 40) / cardsPerView;

    cards.forEach(card => {
      card.style.width = `${cardWidth}px`;
    });

    track.style.gap = '20px';
  }

  function attachCardButtons() {
    const buttons = document.querySelectorAll('.block3__btn');
    buttons.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = newBtn.closest('.block3__card');
        const name = card?.querySelector('.block3__name')?.innerText || 'Участник';
        alert(`Подробнее о ${name}`);
      });
    });
  }

  function updateSliderPosition(animate = true) {
    const card = track?.querySelector('.block3__card');
    if (!card) return;

    const cardWidth = card.offsetWidth + 20;
    const offset = currentIndex * cardWidth;

    track.style.transition = animate ? 'transform 0.5s ease' : 'none';
    track.style.transform = `translateX(-${offset}px)`;
  }

  function updateCounter() {
    const cardsPerView = isMobile ? 1 : 3;
    let realIndex = ((currentIndex - cardsPerView) % totalCards + totalCards) % totalCards;
    const currentNumber = realIndex + 1;

    const counter = document.getElementById('participantsCounter');
    const mobileCounter = document.getElementById('mobileCounter');

    if (counter) {
      counter.innerHTML = `<span class="current">${currentNumber}</span><span class="total">/${totalCards}</span>`;
    }
    if (mobileCounter) {
      mobileCounter.innerHTML = `<span class="current">${currentNumber}</span><span class="total">/${totalCards}</span>`;
    }
  }

  function moveNext() {
    const cardsPerView = isMobile ? 1 : 3;
    const maxIndex = totalCards + cardsPerView;

    currentIndex++;
    updateSliderPosition(true);

    if (currentIndex >= maxIndex) {
      setTimeout(() => {
        currentIndex = cardsPerView;
        updateSliderPosition(false);
        updateCounter();
      }, 500);
    }
    updateCounter();
  }

  function movePrev() {
    const cardsPerView = isMobile ? 1 : 3;

    currentIndex--;
    updateSliderPosition(true);

    if (currentIndex < cardsPerView) {
      setTimeout(() => {
        currentIndex = totalCards + cardsPerView - 1;
        updateSliderPosition(false);
        updateCounter();
      }, 500);
    }
    updateCounter();
  }

  function updateNavigation() {
    const prevBtn = document.getElementById('participantsPrev');
    const nextBtn = document.getElementById('participantsNext');

    if (prevBtn && nextBtn) {
      // Убираем старые обработчики
      const newPrev = prevBtn.cloneNode(true);
      const newNext = nextBtn.cloneNode(true);
      prevBtn.parentNode.replaceChild(newPrev, prevBtn);
      nextBtn.parentNode.replaceChild(newNext, nextBtn);

      newPrev.addEventListener('click', () => {
        stopAutoSlide();
        movePrev();
        startAutoSlide();
      });

      newNext.addEventListener('click', () => {
        stopAutoSlide();
        moveNext();
        startAutoSlide();
      });
    }
  }

  function updateMobileNav() {
    let mobileNav = document.querySelector('.block3__mobile-nav');

    if (isMobile) {
      if (!mobileNav) {
        const sliderWrapper = document.querySelector('.block3__slider-wrapper');
        const nav = document.createElement('div');
        nav.className = 'block3__mobile-nav';
        nav.innerHTML = `
          <button class="block3__nav-btn" id="mobilePrev"></button>
          <span class="block3__counter" id="mobileCounter"></span>
          <button class="block3__nav-btn" id="mobileNext"></button>
        `;
        sliderWrapper.after(nav);

        const mobilePrev = document.getElementById('mobilePrev');
        const mobileNext = document.getElementById('mobileNext');

        if (mobilePrev && mobileNext) {
          mobilePrev.addEventListener('click', () => {
            stopAutoSlide();
            movePrev();
            startAutoSlide();
          });
          mobileNext.addEventListener('click', () => {
            stopAutoSlide();
            moveNext();
            startAutoSlide();
          });
        }

        updateCounter();
      }
    } else {
      if (mobileNav) mobileNav.remove();
    }
  }

  function setupEventListeners() {
    const slider = document.querySelector('.block3__slider');
    if (slider) {
      slider.addEventListener('transitionend', () => {
        updateCounter();
      });
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideInterval = setInterval(() => moveNext(), 4000);
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  document.addEventListener('DOMContentLoaded', initBlock3);
})();