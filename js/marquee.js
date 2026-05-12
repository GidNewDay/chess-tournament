function initMarquee(trackElement) {
  // Оригинальный текст (первый дочерний .marquee__text)
  const original = trackElement.querySelector('.marquee__text');
  if (!original) return;
  
  // Создаём 3 копии (всего 4)
  for (let i = 0; i < 3; i++) {
    const clone = original.cloneNode(true);
    trackElement.appendChild(clone);
  }
  
  // Универсальная скорость (пикселей в секунду)
  const desiredSpeed = 50;
  
  // Общая ширина трека
  const trackWidth = trackElement.scrollWidth;
  
  // Сдвиг за цикл = 25% от ширины (потому что у нас 4 элемента)
  const shiftPx = trackWidth * 0.25;
  
  // Длительность цикла в секундах
  const durationSeconds = shiftPx / desiredSpeed;
  
  // Применяем анимацию к этому треку
  trackElement.style.animationDuration = `${durationSeconds}s`;
}

// Инициализация всех бегущих строк на странице
document.addEventListener('DOMContentLoaded', () => {
  const allTracks = document.querySelectorAll('.marquee__track');
  allTracks.forEach(track => initMarquee(track));
});