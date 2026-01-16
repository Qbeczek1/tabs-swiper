# Tabs Swiper

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/Qbeczek1/tabs-swiper/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/)

Chrome extension for swiping through tabs like Tinder - swipe left to close, swipe right to keep. Idealne do szybkiego porządkowania setek otwartych zakładek.

## 🎯 Features

- ✅ Przeglądanie wszystkich zakładek ze wszystkich okien Chrome
- ✅ Favicon + tytuł + URL jako podgląd (lekki i szybki)
- ✅ Swipe gesty (myszka/touch)
- ✅ Przyciski do szybkiej akcji
- ✅ Obsługa klawiatury (strzałki, Escape)
- ✅ Animacje w stylu Tinder
- ✅ Efekt 3D - widać kolejne karty pod spodem

## 📦 Installation

### Krok 1: Przygotuj ikony

Rozszerzenie wymaga ikon PNG w rozmiarach 16x16, 48x48 i 128x128 pikseli.

**Opcja A - Użyj generate-icons.html:**
1. Otwórz `generate-icons.html` w przeglądarce
2. Ikony PNG zostaną automatycznie pobrane

**Opcja B - Konwersja SVG:**
1. Użyj narzędzia online (np. convertio.co) do konwersji SVG → PNG
2. Przekonwertuj `icons/icon16.svg`, `icon48.svg`, `icon128.svg`
3. Zapisz jako `icon16.png`, `icon48.png`, `icon128.png` w katalogu `icons/`

### Krok 2: Załaduj rozszerzenie

1. Otwórz Chrome i przejdź do `chrome://extensions/`
2. Włącz "Tryb deweloperski" (Developer mode) w prawym górnym rogu
3. Kliknij "Załaduj rozpakowane" (Load unpacked)
4. Wybierz katalog `tabs-swiper`

## 🚀 Usage

1. **Otwórz Swiper:** Kliknij ikonę rozszerzenia w pasku narzędzi Chrome
2. **Przeglądaj zakładki:** Zobaczysz karty z favicon, tytułem i URL każdej zakładki
3. **Decyduj:**
   - **Swipe left / przycisk ✕ / klawisz ←** - zamknij zakładkę
   - **Swipe right / przycisk ♥ / klawisz →** - zostaw zakładkę
4. **Kontynuuj:** Po każdej decyzji pojawi się następna karta

## 🛠️ Technologies

- **Manifest V3** - najnowszy standard rozszerzeń Chrome
- **Vanilla JavaScript** - bez frameworków, lekki i szybki
- **Chrome APIs:** `tabs`, `windows`

## 📁 Project Structure

```
tabs-swiper/
├── manifest.json          # Konfiguracja rozszerzenia
├── background.js          # Service worker - logika zakładek
├── swiper/
│   ├── swiper.html        # Główny UI
│   ├── swiper.css         # Style + animacje
│   └── swiper.js          # Logika UI + gesty
├── icons/                 # Ikony rozszerzenia
├── generate-icons.html    # Generator ikon PNG
├── generate-icons.js      # Generator ikon SVG
└── docs/
    └── README.md          # Szczegółowa dokumentacja
```

## ⚡ Performance

Rozszerzenie zostało zaprojektowane z myślą o wydajności:
- Brak screenshotów - tylko favicon, tytuł i URL
- Minimalne użycie pamięci
- Szybkie przeglądanie setek zakładek
- Lazy loading - tylko widoczne karty są renderowane

## 📝 License

MIT

## 👤 Author

Stworzone z ❤️ dla szybkiego porządkowania zakładek

---

📖 [Pełna dokumentacja](docs/README.md)
