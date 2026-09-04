// Progressive enhancements: the four pages remain readable without JavaScript.
const filterButtons = [...document.querySelectorAll('[data-filter]')];
const courseCards = [...document.querySelectorAll('#course-list .course-card')];
const emptyState = document.querySelector('.empty-state');
const pagination = document.querySelector('.pagination');
const totalItems = pagination?.querySelector('[data-total-items]');
const pageSize = 6;
let activeCategory = 'all';
let currentPage = 1;

const pageButtons = pagination ? [...pagination.querySelectorAll('[data-page]')] : [];
const previousPageButton = pagination?.querySelector('[data-page="previous"]');
const nextPageButton = pagination?.querySelector('[data-page="next"]');

function renderCourses() {
  if (!courseCards.length) return;

  const filteredCards = courseCards.filter(
    (card) => activeCategory === 'all' || card.dataset.category === activeCategory,
  );
  const pageCount = Math.max(1, Math.ceil(filteredCards.length / pageSize));
  currentPage = Math.min(currentPage, pageCount);
  const firstVisibleIndex = (currentPage - 1) * pageSize;
  const lastVisibleIndex = firstVisibleIndex + pageSize;

  courseCards.forEach((card) => {
    const filteredIndex = filteredCards.indexOf(card);
    const visible = filteredIndex >= firstVisibleIndex && filteredIndex < lastVisibleIndex;
    card.hidden = !visible;
  });

  if (emptyState) emptyState.hidden = filteredCards.length > 0;
  if (!pagination) return;

  pagination.hidden = activeCategory !== 'all' || filteredCards.length === 0;
  if (totalItems) totalItems.textContent = `Total ${filteredCards.length} items`;
  if (previousPageButton) previousPageButton.disabled = currentPage <= 1;
  if (nextPageButton) nextPageButton.disabled = currentPage >= pageCount;

  pageButtons.forEach((button) => {
    const page = Number(button.dataset.page);
    if (!Number.isInteger(page)) return;
    button.hidden = page > pageCount;
    if (page === currentPage) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.filter;
    currentPage = 1;
    filterButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    renderCourses();
  });
});

pageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.page;
    const pageCount = Math.max(1, Math.ceil(courseCards.length / pageSize));
    if (action === 'previous') currentPage -= 1;
    else if (action === 'next') currentPage += 1;
    else currentPage = Number(action);
    currentPage = Math.max(1, Math.min(currentPage, pageCount));
    renderCourses();
  });
});

renderCourses();

document.querySelectorAll('[data-scroll]').forEach((button) => {
  const track = document.getElementById(button.dataset.scroll);
  if (!track) return;
  const update = () => {
    const overflow = track.scrollWidth - track.clientWidth;
    const previous = button.dataset.direction === '-1';
    button.disabled =
      overflow < 2 || (previous ? track.scrollLeft <= 1 : track.scrollLeft >= overflow - 1);
  };
  button.addEventListener('click', () => {
    const firstSlide = track.firstElementChild;
    const slideWidth = firstSlide?.getBoundingClientRect().width || 280;
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap || '24') || 24;
    const direction = Number(button.dataset.direction);
    track.scrollBy({
      left: (slideWidth + gap) * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
    });
  });
  track.addEventListener('scroll', update, { passive: true });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  update();
});

const registrationForm = document.querySelector('.registration-form');
if (registrationForm) {
  // Keep the static demo from submitting personal data if JavaScript is unavailable.
  registrationForm.querySelector('[type="submit"]').disabled = false;
  const course = new URLSearchParams(window.location.search).get('course');
  const opinion = document.querySelector('#opinion');
  if (course && opinion) opinion.value = `I would like to register for ${course.slice(0, 100)}.`;
  registrationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!registrationForm.reportValidity()) return;
    const result = document.querySelector('.form-result');
    result.textContent = 'The form is valid. This is a demo; your information has not been sent.';
    result.hidden = false;
    result.focus();
  });
}
