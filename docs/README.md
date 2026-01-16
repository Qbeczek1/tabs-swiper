# Tabs Swiper

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Qbeczek1/tabs-swiper/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/)

Chrome extension for swiping through tabs like Tinder - swipe left to close, swipe right to keep. Idealne do szybkiego porządkowania setek otwartych zakładek.

**Wersja:** 1.0.0  
**Manifest:** V3

## Wymagania

- Google Chrome (najnowsza wersja)

## Instalacja

1. Otwórz Chrome i przejdź do `chrome://extensions/`

2. Włącz "Tryb deweloperski" (Developer mode) w prawym górnym rogu
3. Kliknij "Załaduj rozpakowane" (Load unpacked)
4. Wybierz katalog `tabs-swiper`

## Użycie

1. **Otwórz Swiper:** Kliknij ikonę rozszerzenia w pasku narzędzi Chrome
2. **Przeglądaj zakładki:** Zobaczysz karty z favicon, tytułem i URL każdej zakładki
3. **Decyduj:**
   - **Swipe left / przycisk ✕ / klawisz ←** - zamknij zakładkę
   - **Swipe right / przycisk ♥ / klawisz →** - zostaw zakładkę
4. **Kontynuuj:** Po każdej decyzji pojawi się następna karta

## Funkcje

- ✅ Przeglądanie wszystkich zakładek ze wszystkich okien Chrome
- ✅ Favicon + tytuł + URL jako podgląd (lekki i szybki)
- ✅ Swipe gesty (myszka/touch)
- ✅ Przyciski do szybkiej akcji
- ✅ Obsługa klawiatury (strzałki, Escape)
- ✅ Animacje w stylu Tinder
- ✅ Efekt 3D - widać kolejne karty pod spodem

## Struktura Projektu

```
tabs-swiper/
├── manifest.json          # Konfiguracja rozszerzenia
├── background.js          # Service worker - logika zakładek
├── swiper/
│   ├── swiper.html        # Główny UI
│   ├── swiper.css         # Style + animacje
│   └── swiper.js          # Logika UI + gesty
├── icons/                 # Ikony rozszerzenia
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── generate-icons.html    # Generator ikon PNG (otwórz w przeglądarce)
├── generate-icons.js      # Generator ikon SVG (Node.js)
└── docs/
    └── README.md          # Ta dokumentacja
```

## Technologie

- **Manifest V3** - najnowszy standard rozszerzeń Chrome
- **Vanilla JavaScript** - bez frameworków, lekki i szybki
- **Chrome APIs:** `tabs`, `windows`

## Rozwój

### Jak działa

1. **Service Worker (background.js):**

   - Pobiera listę wszystkich zakładek
   - Obsługuje zamykanie zakładek

2. **UI (swiper.html/js/css):**
   - Wyświetla karty w stosie (efekt 3D)
   - Pokazuje favicon, tytuł i URL każdej zakładki
   - Wykrywa gesty swipe (drag & drop)
   - Animuje przejścia między kartami
   - Komunikuje się z service workerem przez messages

### Debugowanie

1. Otwórz `chrome://extensions/`
2. Znajdź "Tabs Swiper" i kliknij "service worker" (dla background.js)
3. Dla UI: kliknij prawym na kartę swipera → "Zbadaj" (Inspect)

## Ograniczenia

- Zakładki `chrome://` i `chrome-extension://` są pomijane (ograniczenie Chrome)
- Nie ma podglądu wizualnego strony - tylko favicon, tytuł i URL (celowo, dla wydajności)
- Rozszerzenie działa tylko w Chrome (nie w innych przeglądarkach opartych na Chromium bez dodatkowej konfiguracji)

## Wydajność

Rozszerzenie zostało zaprojektowane z myślą o wydajności:

- Brak screenshotów - tylko favicon, tytuł i URL
- Minimalne użycie pamięci
- Szybkie przeglądanie setek zakładek
- Lazy loading - tylko widoczne karty są renderowane

## Licencja

MIT

## Autor

Stworzone z ❤️ dla szybkiego porządkowania zakładek
