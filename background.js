// Service Worker dla Tabs Swiper
let swiperTabId = null;

// Otwórz Swiper UI po kliknięciu ikony
chrome.action.onClicked.addListener(async (tab) => {
  const swiperUrl = chrome.runtime.getURL('swiper/swiper.html');
  const swiperTab = await chrome.tabs.create({ url: swiperUrl });
  swiperTabId = swiperTab.id;
});

// Pobierz wszystkie zakładki ze wszystkich okien (pomijając swipera)
async function getAllTabs() {
  const windows = await chrome.windows.getAll({ populate: true });
  const allTabs = [];

  for (const window of windows) {
    for (const tab of window.tabs || []) {
      // Pomijamy kartę swipera i karty chrome://
      if (tab.id !== swiperTabId && !tab.url?.startsWith('chrome://')) {
        allTabs.push({
          id: tab.id,
          url: tab.url,
          title: tab.title,
          favIconUrl: tab.favIconUrl,
          windowId: tab.windowId
        });
      }
    }
  }

  return allTabs;
}

// Zamknij zakładkę
async function closeTab(tabId) {
  try {
    await chrome.tabs.remove(tabId);
    return true;
  } catch (error) {
    console.error('Error closing tab:', error);
    return false;
  }
}

// Obsługa wiadomości z UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAllTabs') {
    getAllTabs().then(tabs => {
      sendResponse({ success: true, tabs });
    });
    return true; // Async response
  }

  if (request.action === 'closeTab') {
    closeTab(request.tabId).then(success => {
      sendResponse({ success });
    });
    return true;
  }

  if (request.action === 'setSwiperTabId') {
    swiperTabId = request.tabId;
    sendResponse({ success: true });
    return false;
  }
});
