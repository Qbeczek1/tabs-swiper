# Tabs Swiper

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/Qbeczek1/tabs-swiper/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow.svg)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-orange.svg)](https://developer.chrome.com/docs/extensions/mv3/)

Chrome extension for swiping through tabs like Tinder - swipe left to close, swipe right to keep. Idealne do szybkiego porządkowania setek otwartych zakładek.

![Tabs Swiper Screenshot](screenshot-tabs-swiper.jpg)

## 🎯 Features

- ✅ Przeglądanie wszystkich zakładek ze wszystkich okien Chrome
- ✅ Favicon + tytuł + URL jako podgląd (lekki i szybki)
- ✅ Swipe gesty (myszka/touch)
- ✅ Przyciski do szybkiej akcji
- ✅ Obsługa klawiatury (strzałki, Escape)
- ✅ Animacje w stylu Tinder
- ✅ Efekt 3D - widać kolejne karty pod spodem
- ✅ Interfejs po angielsku i polsku (wybierany automatycznie wg języka przeglądarki)

## 📦 Installation

### Krok 1: Pobierz repozytorium

```bash
git clone https://github.com/Qbeczek1/tabs-swiper.git
cd tabs-swiper
```

Lub pobierz jako [ZIP](https://github.com/Qbeczek1/tabs-swiper/archive/refs/heads/master.zip) i rozpakuj.

### Krok 2: Załaduj rozszerzenie w Chrome

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
- **Chrome APIs:** `tabs`, `windows` (jedyne wymagane uprawnienie: `tabs`)

## 📁 Project Structure

```
tabs-swiper/
├── manifest.json          # Konfiguracja rozszerzenia
├── _locales/               # Tłumaczenia: en (domyślny), pl
├── background.js          # Service worker - otwiera swipera / przełącza na otwarty
├── swiper/
│   ├── swiper.html        # Główny UI
│   ├── swiper.css         # Style + animacje
│   └── swiper.js          # Logika zakładek, UI + gesty
├── icons/                 # Ikony rozszerzenia
├── scripts/build_zip.py   # Buduje paczkę do Chrome Web Store
└── store/                 # Opisy do sklepu (nie trafiają do paczki)
```

## ⚡ Performance

Rozszerzenie zostało zaprojektowane z myślą o wydajności:

- Brak screenshotów - tylko favicon, tytuł i URL
- Minimalne użycie pamięci
- Szybkie przeglądanie setek zakładek
- Lazy loading - tylko widoczne karty są renderowane

## 🌍 Tłumaczenia

Teksty interfejsu są w `_locales/<język>/messages.json`. Nowy język = nowy folder z kopią `en/messages.json` i przetłumaczonymi wartościami `message`. Chrome sam wybiera język przeglądarki, a gdy go nie ma, używa angielskiego.

## 🚢 Release

Przykład dla wersji `1.3.0`; podmień numer.

1. **Wersja:** podbij `version` w `manifest.json` i odznakę wersji na górze tego README. Numer musi być wyższy niż opublikowany w sklepie.
2. **Commit i push:** najpierw `git fetch` + `git status`, przy zaległościach `git pull --ff-only`, potem `git push`.
3. **Paczka:** z roota repo:
   ```bash
   python scripts/build_zip.py
   ```
   Powstaje `tabs-swiper-1.3.0.zip` (ignorowany przez git). Nie pakuj ręcznie: `tar` z Git Basha robi zwykły tar zamiast ZIP-a, a `Compress-Archive` w PowerShell 5.1 potrafi zapisać ścieżki z backslashami, przez co sklep odrzuca paczkę.
4. **Tag i release na GitHubie:**
   ```bash
   git tag -a v1.3.0 -m "v1.3.0 - krótki opis"
   git push origin v1.3.0
   gh release create v1.3.0 tabs-swiper-1.3.0.zip --verify-tag --title "v1.3.0 - krótki opis" --notes-file notes.md
   ```
   Notatki po angielsku, w układzie poprzednich release'ów (New Features / Improvements / Bug Fixes).
5. **Chrome Web Store:** [Developer Dashboard](https://chrome.google.com/webstore/devconsole) > Tabs Swiper > Package > Upload new package > wybierz ZIP > Submit for review.
   - Nowej paczki nie wgrasz, dopóki poprzednia wersja czeka na recenzję (trzeba poczekać albo anulować tamtą recenzję).
   - Opis w Store listing jest osobno dla każdego języka z `_locales`. Angielski trzymamy w `store/description-en.txt`; po zmianach funkcji zaktualizuj plik i wklej go pod EN.
   - Recenzja trwa od kilku godzin do kilku dni; po akceptacji Chrome sam aktualizuje rozszerzenie użytkownikom.

## 📝 License

MIT

## 👤 Author

Stworzone z ❤️ dla szybkiego porządkowania zakładek
