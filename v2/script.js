(() => {
  const header = document.querySelector('[data-header]');
  const rail = document.querySelector('[data-work-rail]');
  const cards = Array.from(document.querySelectorAll('[data-work-card]'));
  const counter = document.querySelector('[data-work-count]');
  const previous = document.querySelector('[data-work-prev]');
  const next = document.querySelector('[data-work-next]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const setHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
  setHeader();
  window.addEventListener('scroll', setHeader, { passive: true });

  if (!rail || cards.length === 0) return;

  const behavior = () => reducedMotion.matches ? 'auto' : 'smooth';
  const nearestCardIndex = () => {
    const railLeft = rail.getBoundingClientRect().left;
    let best = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - railLeft);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        best = index;
      }
    });
    return best;
  };

  const updateCounter = () => {
    const index = nearestCardIndex();
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    if (previous) previous.disabled = index === 0;
    if (next) next.disabled = index === cards.length - 1;
  };

  const showCard = (index) => {
    const bounded = Math.max(0, Math.min(cards.length - 1, index));
    cards[bounded].scrollIntoView({ behavior: behavior(), block: 'nearest', inline: 'start' });
  };

  previous?.addEventListener('click', () => showCard(nearestCardIndex() - 1));
  next?.addEventListener('click', () => showCard(nearestCardIndex() + 1));
  rail.addEventListener('scroll', updateCounter, { passive: true });
  rail.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showCard(nearestCardIndex() + 1);
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showCard(nearestCardIndex() - 1);
    }
  });

  rail.addEventListener('wheel', (event) => {
    if (window.innerWidth <= 620 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const atStart = rail.scrollLeft <= 0 && event.deltaY < 0;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 && event.deltaY > 0;
    if (atStart || atEnd) return;
    event.preventDefault();
    rail.scrollBy({ left: event.deltaY, behavior: 'auto' });
  }, { passive: false });

  updateCounter();
})();
