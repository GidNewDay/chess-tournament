// Конфигурация слайдов: какие индексы пунктов в каждом слайде (индексы от 0 до 6)
const slidesMapping = [
  [0, 1], // слайд 1: пункты 1 и 2
  [2], // слайд 2: пункт 3
  [3, 4], // слайд 3: пункты 4 и 5
  [5], // слайд 4: пункт 6
  [6], // слайд 5: пункт 7
];

let currentSlide = 0;
let slidesContainer = null;
let sliderWrapper = null;
let gridContainer = null;

function initBlock2() {
  const isMobile = window.innerWidth < 1024;
  const sourceContainer = document.querySelector(".block2__items-source");
  const grid = document.querySelector(".block2__grid");
  const sliderWrap = document.querySelector(".block2__slider-wrapper");

  if (!sourceContainer || !grid || !sliderWrap) return;

  if (isMobile) {
    // Показываем слайдер, скрываем сетку
    grid.style.display = "none";
    sliderWrap.style.display = "block";

    // Если слайдер уже инициализирован и наполнен, не пересоздаём
    if (sliderWrap.hasChildNodes()) return;

    // Строим слайдер заново, клонируя пункты из источника (без дублирования в DOM)
    buildSlider(sourceContainer, sliderWrap);
  } else {
    // Показываем сетку, скрываем слайдер
    sliderWrap.style.display = "none";
    grid.style.display = "grid";

    // Если сетка пуста, заполняем её клонами из источника
    if (grid.children.length === 0) {
      const items = sourceContainer.querySelectorAll(".block2__item");
      items.forEach((item) => {
        grid.appendChild(item.cloneNode(true));
      });
    }
    // Если слайдер был, удаляем его содержимое, чтобы не занимало память
    sliderWrap.innerHTML = "";
  }
}

function buildSlider(source, target) {
  const items = source.querySelectorAll(".block2__item");
  // Создаём обёртку для слайдера
  target.innerHTML = `
    <div class="block2__slider">
      <div class="block2__slides-container" id="slidesContainer">
        ${slidesMapping.map((_, idx) => `<div class="block2__slide" data-slide="${idx}"></div>`).join("")}
      </div>
      <div class="block2__slider-nav">
        <button class="block2__slider-btn" id="sliderPrev"></button>
        <div class="block2__slider-dots" id="sliderDots"></div>
        <button class="block2__slider-btn" id="sliderNext"></button>
      </div>
    </div>
  `;

  // Заполняем слайды пунктами (клонируем из источника)
  const slides = target.querySelectorAll(".block2__slide");
  slidesMapping.forEach((indices, slideIdx) => {
    const slideDiv = slides[slideIdx];
    const contentDiv = document.createElement("div");
    contentDiv.className = "block2__slide-content";
    indices.forEach((itemIdx) => {
      const originalItem = items[itemIdx];
      if (originalItem) {
        contentDiv.appendChild(originalItem.cloneNode(true));
      }
    });
    slideDiv.appendChild(contentDiv);
  });

  // Добавляем точки
  const dotsContainer = target.querySelector("#sliderDots");
  slidesMapping.forEach((_, idx) => {
    const dot = document.createElement("div");
    dot.className = `block2__dot ${idx === currentSlide ? "active" : ""}`;
    dot.dataset.dot = idx;
    dotsContainer.appendChild(dot);
  });

  // Навешиваем события
  const container = target.querySelector("#slidesContainer");
  const prevBtn = target.querySelector("#sliderPrev");
  const nextBtn = target.querySelector("#sliderNext");
  const dots = target.querySelectorAll(".block2__dot");

  function updateSlider(index) {
    const totalSlides = slidesMapping.length;

    // Ограничиваем индекс
    if (index < 0) index = 0;
    if (index >= totalSlides) index = totalSlides - 1;

    currentSlide = index;

    // Плавная прокрутка
    container.scrollTo({
      left: currentSlide * container.clientWidth,
      behavior: "smooth",
    });

    // Обновляем активные точки
    dots.forEach((dot, i) =>
      dot.classList.toggle("active", i === currentSlide),
    );

    // Управление disabled для кнопок
    if (prevBtn) {
      if (currentSlide === 0) {
        prevBtn.setAttribute("disabled", "disabled");
      } else {
        prevBtn.removeAttribute("disabled");
      }
    }

    if (nextBtn) {
      if (currentSlide === totalSlides - 1) {
        nextBtn.setAttribute("disabled", "disabled");
      } else {
        nextBtn.removeAttribute("disabled");
      }
    }
  }
  prevBtn.disabled = true; // на первом слайде "Назад" отключена
  nextBtn.disabled = false; // "Вперёд" активна

  prevBtn.addEventListener("click", () => updateSlider(currentSlide - 1));
  nextBtn.addEventListener("click", () => updateSlider(currentSlide + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) =>
      updateSlider(parseInt(e.target.dataset.dot, 10)),
    );
  });

  container.addEventListener("scroll", () => {
    const scrollPos = container.scrollLeft;
    const slideWidth = container.clientWidth;
    const newIndex = Math.round(scrollPos / slideWidth);
    if (
      newIndex !== currentSlide &&
      newIndex >= 0 &&
      newIndex < slidesMapping.length
    ) {
      currentSlide = newIndex;
      dots.forEach((dot, i) =>
        dot.classList.toggle("active", i === currentSlide),
      );
    }
  });
}

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // При ресайзе полностью пересоздаём блок (очищаем контейнеры и заново)
    const grid = document.querySelector(".block2__grid");
    const sliderWrap = document.querySelector(".block2__slider-wrapper");
    if (grid) grid.innerHTML = "";
    if (sliderWrap) sliderWrap.innerHTML = "";
    initBlock2();
  }, 150);
});

document.addEventListener("DOMContentLoaded", initBlock2);
