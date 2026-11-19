// Service Worker dla Tabs Swiper
// Tylko obsługa kliknięcia ikony. Logika zakładek żyje w swiper.js,
// bo service worker w MV3 jest usypiany i nie może trzymać stanu w zmiennych.

const SWIPER_URL = chrome.runtime.getURL('swiper/swiper.html');

// Otwórz Swiper UI po kliknięciu ikony - albo przełącz na już otwarty
chrome.action.onClicked.addListener(async () => {
  const existing = await chrome.tabs.query({ url: SWIPER_URL });

  if (existing.length > 0) {
    const tab = existing[0];
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    return;
  }

  await chrome.tabs.create({ url: SWIPER_URL });
});
