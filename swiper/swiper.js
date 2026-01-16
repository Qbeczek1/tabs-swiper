// Tabs Swiper - główna logika UI

let tabs = [];
let currentIndex = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let currentX = 0;
let currentY = 0;
let currentCard = null;
let closedTabsCount = 0; // Licznik zamkniętych zakładek

const SWIPE_THRESHOLD = 100; // Minimalna odległość dla swipe
const ROTATION_FACTOR = 0.1;

// Elementy DOM
const cardsStack = document.getElementById('cards-stack');
const loadingEl = document.getElementById('loading');
const emptyEl = document.getElementById('empty');
const btnClose = document.getElementById('btn-close');
const btnKeep = document.getElementById('btn-keep');
const currentIndexEl = document.getElementById('current-index');
const totalTabsEl = document.getElementById('total-tabs');

// Inicjalizacja
async function init() {
  // Poinformuj background o ID tej karty
  const tab = await chrome.tabs.getCurrent();
  chrome.runtime.sendMessage({ action: 'setSwiperTabId', tabId: tab.id });
  
  // Pobierz wszystkie zakładki
  const response = await chrome.runtime.sendMessage({ action: 'getAllTabs' });
  
  if (response && response.success) {
    tabs = response.tabs;
    totalTabsEl.textContent = tabs.length;
    
    if (tabs.length === 0) {
      showEmpty();
      return;
    }
    
    loadingEl.style.display = 'none';
    
    // Załaduj pierwsze 3 karty
    await loadCards();
  }
}

// Załaduj karty do wyświetlenia
async function loadCards() {
  const cardsToLoad = Math.min(3, tabs.length - currentIndex);
  
  for (let i = 0; i < cardsToLoad; i++) {
    const tabIndex = currentIndex + i;
    if (tabIndex >= tabs.length) break;
    
    const tab = tabs[tabIndex];
    const card = createCard(tab, i);
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
  if (currentIndex >= tabs.length) return;
  
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
function endDrag(e) {
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
    updateSwipeIndicator(0);
  }
  
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

// Zamknij zakładkę
async function closeTab() {
  if (currentIndex >= tabs.length) return;
  
  const tab = tabs[currentIndex];
  const card = document.querySelector('.card-stack-1');
  
  if (card) {
    card.classList.add('swipe-left');
    setTimeout(() => {
      card.remove();
      processNext();
    }, 300);
  }
  
  await chrome.runtime.sendMessage({ action: 'closeTab', tabId: tab.id });
  
  // Zwiększ licznik i sprawdź milestone
  closedTabsCount++;
  saveClosedTabsCount();
  checkMilestone();
}

// Zostaw zakładkę
async function keepTab() {
  if (currentIndex >= tabs.length) return;
  
  const card = document.querySelector('.card-stack-1');
  
  if (card) {
    card.classList.add('swipe-right');
    setTimeout(() => {
      card.remove();
      processNext();
    }, 300);
  }
}

// Przetwórz następną kartę
async function processNext() {
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
    const tab = tabs[currentIndex + 2];
    const newCard = createCard(tab, 2);
    cardsStack.appendChild(newCard);
  }
  
  if (currentIndex >= tabs.length) {
    showEmpty();
  }
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

// Obsługa klawiatury
document.addEventListener('keydown', (e) => {
  if (currentIndex >= tabs.length) return;
  
  if (e.key === 'ArrowLeft') {
    closeTab();
  } else if (e.key === 'ArrowRight') {
    keepTab();
  } else if (e.key === 'Escape') {
    window.close();
  }
});

// Milestone'y i komunikaty
const milestones = [
  { count: 10, message: 'Super Ci idzie! 🎉', emoji: '🎉' },
  { count: 25, message: 'Dobra robota! 🔥', emoji: '🔥' },
  { count: 50, message: 'Czyść dalej! 💪', emoji: '💪' },
  { count: 100, message: 'Niesamowite! 🚀', emoji: '🚀' },
  { count: 250, message: 'Mistrz porządkowania! 👑', emoji: '👑' }
];

// Sprawdź czy osiągnięto milestone
function checkMilestone() {
  const milestone = milestones.find(m => m.count === closedTabsCount);
  
  if (milestone) {
    showCelebration(milestone.message, milestone.emoji);
  }
}

// Pokaż animację fajerwerków
function showCelebration(message, emoji) {
  const overlay = document.getElementById('celebration-overlay');
  const messageEl = document.getElementById('celebration-message');
  
  if (!overlay || !messageEl) {
    console.error('Celebration elements not found');
    return;
  }
  
  // Ustaw komunikat
  messageEl.textContent = message;
  
  // Pokaż overlay
  overlay.style.display = 'flex';
  
  // Funkcja zamykania
  let escapeHandler = null;
  const closeCelebration = () => {
    overlay.style.display = 'none';
    if (typeof confetti !== 'undefined' && confetti.reset) {
      confetti.reset();
    }
    // Usuń event listenery
    if (escapeHandler) {
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  
  // Zamknij po kliknięciu na overlay (tylko tło, nie modal)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeCelebration();
    }
  });
  
  // Przycisk zamknij
  const closeBtn = document.getElementById('celebration-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCelebration();
    });
  }
  
  // Zamknij po Escape
  escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeCelebration();
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Uruchom animację confetti jeśli dostępne
  if (typeof confetti !== 'undefined') {
    const duration = 3000;
    const end = Date.now() + duration;
    
    const colors = ['#667eea', '#764ba2', '#ff6b6b', '#51cf66', '#ffd93d'];
    
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  } else {
    console.warn('Confetti library not loaded');
  }
  
  // Auto-ukryj po 3 sekundach
  setTimeout(() => {
    closeCelebration();
  }, 3000);
}

// Inicjalizuj licznik z sessionStorage
function initClosedTabsCount() {
  const stored = sessionStorage.getItem('tabsSwiperClosedCount');
  if (stored) {
    closedTabsCount = parseInt(stored, 10);
  } else {
    closedTabsCount = 0;
  }
}

// Zapisz licznik do sessionStorage
function saveClosedTabsCount() {
  sessionStorage.setItem('tabsSwiperClosedCount', closedTabsCount.toString());
}

// Start
init();
initClosedTabsCount();