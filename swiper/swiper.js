// Tabs Swiper - główna logika UI

let tabs = [];
let currentIndex = 0;
let isDragging = false;
let isAnimating = false; // Blokada na czas animacji - bez niej szybkie klawisze pomijały karty
let dragStartX = 0;
let dragStartY = 0;
let currentX = 0;
let currentY = 0;
let currentCard = null;
let closedTabsCount = 0; // Licznik zamkniętych zakładek
let keptTabsCount = 0; // Licznik zostawionych zakładek
let celebrationTimer = null;

const SWIPE_THRESHOLD = 100; // Minimalna odległość dla swipe
const ROTATION_FACTOR = 0.1;
const ANIMATION_MS = 300;

// Karty, których nie pokazujemy: strony przeglądarki i strony tego rozszerzenia
const OWN_EXTENSION_PREFIX = chrome.runtime.getURL('');
const SKIPPED_PREFIXES = ['chrome://', 'devtools://', 'chrome-untrusted://', 'edge://', OWN_EXTENSION_PREFIX];

// Elementy DOM
const cardsStack = document.getElementById('cards-stack');
const loadingEl = document.getElementById('loading');
const emptyEl = document.getElementById('empty');
const btnClose = document.getElementById('btn-close');
const btnKeep = document.getElementById('btn-keep');
const currentIndexEl = document.getElementById('current-index');
const totalTabsEl = document.getElementById('total-tabs');
const closedCountEl = document.getElementById('closed-count');
const keptCountEl = document.getElementById('kept-count');
const celebrationOverlay = document.getElementById('celebration-overlay');
const celebrationMessageEl = document.getElementById('celebration-message');
const celebrationCloseBtn = document.getElementById('celebration-close');

// Pobierz wszystkie zakładki ze wszystkich okien (pomijając swipera i strony przeglądarki)
async function getAllTabs() {
  const windows = await chrome.windows.getAll({ populate: true });
  const allTabs = [];

  for (const win of windows) {
    for (const tab of win.tabs || []) {
      const url = tab.url || tab.pendingUrl || '';
      if (SKIPPED_PREFIXES.some(prefix => url.startsWith(prefix))) continue;

      allTabs.push({
        id: tab.id,
        url,
        title: tab.title,
        favIconUrl: tab.favIconUrl,
        windowId: tab.windowId
      });
    }
  }

  return allTabs;
}

// Inicjalizacja
async function init() {
  try {
    tabs = await getAllTabs();
  } catch (error) {
    console.error('Error loading tabs:', error);
    loadingEl.querySelector('.spinner')?.remove();
    loadingEl.querySelector('p').textContent = 'Nie udało się pobrać zakładek. Odśwież stronę (F5).';
    return;
  }

  totalTabsEl.textContent = tabs.length;

  if (tabs.length === 0) {
    showEmpty();
    return;
  }

  loadingEl.style.display = 'none';
  loadCards();
}

// Załaduj karty do wyświetlenia
function loadCards() {
  const cardsToLoad = Math.min(3, tabs.length - currentIndex);

  for (let i = 0; i < cardsToLoad; i++) {
    const card = createCard(tabs[currentIndex + i], i);
    cardsStack.appendChild(card);
  }
}

// Utwórz kartę
function createCard(tab, stackIndex) {
  const card = document.createElement('div');
  card.className = `card card-stack-${stackIndex + 1}`;
  card.dataset.tabId = tab.id;
  card.dataset.stackIndex = stackIndex;

  const imageDiv = document.createElement('div');
  imageDiv.className = 'card-image';

  // Placeholder z favicon
  const placeholder = document.createElement('div');
  placeholder.className = 'placeholder';
  if (tab.favIconUrl) {
    const faviconImg = document.createElement('img');
    faviconImg.src = tab.favIconUrl;
    faviconImg.alt = 'favicon';
    faviconImg.style.width = '64px';
    faviconImg.style.height = '64px';
    faviconImg.style.marginBottom = '20px';
    placeholder.appendChild(faviconImg);
  } else {
    placeholder.textContent = '🌐';
    placeholder.style.fontSize = '64px';
  }
  imageDiv.appendChild(placeholder);

  const infoDiv = document.createElement('div');
  infoDiv.className = 'card-info';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'card-title';
  titleDiv.textContent = tab.title || 'Bez tytułu';

  const urlDiv = document.createElement('div');
  urlDiv.className = 'card-url';
  urlDiv.textContent = tab.url || '';

  infoDiv.appendChild(titleDiv);
  infoDiv.appendChild(urlDiv);

  card.appendChild(imageDiv);
  card.appendChild(infoDiv);

  // Event listeners dla drag
  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag, { passive: false });

  return card;
}

// Rozpocznij przeciąganie
function startDrag(e) {
  if (currentIndex >= tabs.length || isAnimating) return;

  const card = e.currentTarget;
  if (card.dataset.stackIndex !== '0') return; // Tylko górna karta

  isDragging = true;
  currentCard = card;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  dragStartX = clientX;
  dragStartY = clientY;

  card.classList.add('dragging');

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag, { passive: false });
  document.addEventListener('touchend', endDrag);

  e.preventDefault();
}

// Podczas przeciągania
function onDrag(e) {
  if (!isDragging || !currentCard) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  currentX = clientX - dragStartX;
  currentY = clientY - dragStartY;

  const rotation = currentX * ROTATION_FACTOR;

  currentCard.style.transform = `translateX(${currentX}px) translateY(${currentY}px) rotate(${rotation}deg)`;

  // Wskaźnik kierunku
  updateSwipeIndicator(currentX);

  e.preventDefault();
}

// Zakończ przeciąganie
function endDrag() {
  if (!isDragging || !currentCard) return;

  isDragging = false;
  currentCard.classList.remove('dragging');

  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);

  // Sprawdź czy przekroczono próg
  if (Math.abs(currentX) > SWIPE_THRESHOLD) {
    if (currentX > 0) {
      keepTab();
    } else {
      closeTab();
    }
  } else {
    // Powrót na miejsce
    currentCard.style.transform = '';
  }
  updateSwipeIndicator(0);

  currentX = 0;
  currentY = 0;
  currentCard = null;
}

// Aktualizuj wskaźnik swipe
function updateSwipeIndicator(x) {
  let indicator = document.querySelector('.swipe-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'swipe-indicator';
    cardsStack.appendChild(indicator);
  }

  if (Math.abs(x) > SWIPE_THRESHOLD) {
    indicator.className = `swipe-indicator ${x > 0 ? 'right' : 'left'} show`;
    indicator.textContent = x > 0 ? '✓' : '✕';
  } else {
    indicator.classList.remove('show');
  }
}

// Wspólna animacja zdjęcia górnej karty; zwraca false, gdy akcja jest zablokowana
function swipeTopCard(direction) {
  if (currentIndex >= tabs.length || isAnimating) return false;

  isAnimating = true;
  const card = document.querySelector('.card-stack-1');

  if (card) {
    card.classList.add(direction === 'left' ? 'swipe-left' : 'swipe-right');
  }

  setTimeout(() => {
    card?.remove();
    processNext();
  }, ANIMATION_MS);

  return true;
}

// Zamknij zakładkę
async function closeTab() {
  const tab = tabs[currentIndex];
  if (!swipeTopCard('left')) return;

  try {
    await chrome.tabs.remove(tab.id);
    closedTabsCount++;
    updateStats();
    saveClosedTabsCount();
  } catch (error) {
    // Zakładka zamknięta w międzyczasie gdzie indziej - nie liczymy jej
    console.warn('Tab already gone:', tab.url, error);
  }
}

// Zostaw zakładkę
function keepTab() {
  if (!swipeTopCard('right')) return;

  keptTabsCount++;
  updateStats();
  saveKeptTabsCount();
}

// Przetwórz następną kartę
function processNext() {
  currentIndex++;
  currentIndexEl.textContent = currentIndex;

  // Przesuń karty w górę
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
    card.className = `card card-stack-${index + 1}`;
    card.dataset.stackIndex = index;
  });

  // Załaduj nową kartę jeśli potrzeba
  if (currentIndex + 2 < tabs.length) {
    const newCard = createCard(tabs[currentIndex + 2], 2);
    cardsStack.appendChild(newCard);
  }

  isAnimating = false;

  if (currentIndex >= tabs.length) {
    showEmpty();
    return;
  }

  // Sprawdź milestone po przeglądnięciu zakładki
  checkMilestone();
}

// Pokaż pusty stan
function showEmpty() {
  loadingEl.style.display = 'none';
  emptyEl.style.display = 'block';
  cardsStack.style.display = 'none';
  document.querySelector('.controls').style.display = 'none';
}

// Przyciski
btnClose.addEventListener('click', closeTab);
btnKeep.addEventListener('click', keepTab);

// Obsługa klawiatury - jeden handler, żeby Escape nie robił dwóch rzeczy naraz
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (isCelebrationVisible()) {
      closeCelebration();
    } else {
      window.close();
    }
    return;
  }

  if (currentIndex >= tabs.length) return;

  if (e.key === 'ArrowLeft') {
    closeTab();
  } else if (e.key === 'ArrowRight') {
    keepTab();
  }
});

// Milestone'y i komunikaty - powiązane z liczbą przeglądniętych zakładek
const milestones = [
  { count: 10, message: 'Super Ci idzie! 🎉' },
  { count: 25, message: 'Dobra robota! 🔥' },
  { count: 50, message: 'Czyść dalej! 💪' },
  { count: 100, message: 'Niesamowite! 🚀' },
  { count: 250, message: 'Mistrz porządkowania! 👑' }
];

// Sprawdź czy osiągnięto milestone (na podstawie przeglądniętych zakładek)
function checkMilestone() {
  const milestone = milestones.find(m => m.count === currentIndex);
  if (milestone) {
    showCelebration(milestone.message);
  }
}

function isCelebrationVisible() {
  return celebrationOverlay.style.display !== 'none';
}

function closeCelebration() {
  clearTimeout(celebrationTimer);
  celebrationOverlay.style.display = 'none';
}

// Pokaż animację fajerwerków (listenery rejestrowane raz, niżej)
function showCelebration(message) {
  celebrationMessageEl.textContent = message;
  celebrationOverlay.style.display = 'flex';

  // Auto-ukryj po 3 sekundach
  clearTimeout(celebrationTimer);
  celebrationTimer = setTimeout(closeCelebration, 3000);
}

// Zamknij po kliknięciu na tło (nie na modal)
celebrationOverlay.addEventListener('click', (e) => {
  if (e.target === celebrationOverlay) closeCelebration();
});

celebrationCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  closeCelebration();
});

// Aktualizuj statystyki w UI
function updateStats() {
  closedCountEl.textContent = closedTabsCount;
  keptCountEl.textContent = keptTabsCount;
}

// Inicjalizuj liczniki z sessionStorage
function initCounters() {
  closedTabsCount = parseInt(sessionStorage.getItem('tabsSwiperClosedCount') || '0', 10);
  keptTabsCount = parseInt(sessionStorage.getItem('tabsSwiperKeptCount') || '0', 10);
  updateStats();
}

// Zapisz licznik zamkniętych do sessionStorage
function saveClosedTabsCount() {
  sessionStorage.setItem('tabsSwiperClosedCount', closedTabsCount.toString());
}

// Zapisz licznik zostawionych do sessionStorage
function saveKeptTabsCount() {
  sessionStorage.setItem('tabsSwiperKeptCount', keptTabsCount.toString());
}

// Start
initCounters();
init();
