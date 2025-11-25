<div align="center">

#  LifeLink

**Digital Medical Card Platform**

*A modern web application designed to simplify communication between patients, caregivers, and medical staff*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)](https://getbootstrap.com/)
[![ESLint](https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint)](https://eslint.org/)

---

**[Polski](#polski) | [English](#english)**

</div>

---

## Polski

### Opis

**LifeLink** to nowoczesna aplikacja webowa stworzona podczas **HackHeros**, która ma na celu uproszczenie komunikacji między pacjentami, opiekunami i personelem medycznym. Aplikacja oferuje szybki dostęp do najważniejszych informacji medycznych, wsparcie wielojęzyczne i przyjazny interfejs mobilny.

### Główne funkcje

- **Karta medyczna** - kompleksowy przegląd historii medycznej pacjenta w jednym miejscu
- **Bezpieczna autoryzacja** - system logowania z obsługą NFC
- **Przyjazny interfejs mobilny** - responsywny design dostosowany do urządzeń mobilnych
- **Wielojęzyczność** - pełne wsparcie dla języka polskiego i angielskiego
- **Panel dla personelu medycznego** - intuicyjny dashboard do zarządzania danymi pacjentów
- **Tryb dla dzieci** - specjalny widok karty medycznej dostosowany do najmłodszych
- **Kompleksowe dane** - alergie, choroby przewlekłe, diagnozy, leki, procedury, szczepienia i badania

### 🛠️ Technologie

- **React 19** - nowoczesna biblioteka UI
- **TypeScript 5.9** - typowanie statyczne
- **React Router 7** - routing aplikacji
- **Bootstrap 5** - framework CSS
- **Vite 7** - narzędzie do budowania
- **ESLint 9** - linter kodu

### Struktura projektu

```
src/
 ├─ componets/           # Moduły funkcjonalne (dashboard, karta medyczna, autoryzacja…)
 ├─ assets/              # Zasoby statyczne + tabele lokalizacji
 ├─ context/             # Współdzielone konteksty (np. LanguageContext)
 ├─ main.tsx             # Bootstrap aplikacji z providerami + router
 └─ App.tsx              # Główne trasy i nawigacja
```


#### Wymagania

- **Node.js** 20+ (zalecana wersja LTS)
- **npm** 10+

#### Instalacja zależności

```bash
npm install
```

#### Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

Aplikacja będzie dostępna pod adresem `http://localhost:5173` (domyślnie).

#### Lintowanie kodu

```bash
npm run lint
```

#### Budowanie wersji produkcyjnej

```bash
npm run build
```

Artefakty zostaną umieszczone w katalogu `dist/`. Możesz je podglądnąć lokalnie:

```bash
npm run preview
```

#### Wdrożenie na GitHub Pages

Projekt jest skonfigurowany do wdrożenia na GitHub Pages:

```bash
npm run deploy
```

Skrypt `predeploy` automatycznie zbuduje projekt, a następnie opublikuje zawartość katalogu `dist/` w gałęzi `gh-pages`.

### Dokumentacja API

Dokumentacja API backendu znajduje się w repozytorium: [API.md](https://github.com/indyplaygame/LifeLink/blob/main/API.md)

### Linki do repozytorium backend oraz Harware
- Backend: [LifeLink Backend](https://github.com/indyplaygame/LifeLink/)
- Hardware: [LifeLink Hardware](https://github.com/VicExe0/lifelink-hw)
---

## 🇬🇧 English

### Description

**LifeLink** is a modern web application created during the **HackHeros**, designed to simplify communication between patients, caregivers, and medical staff. The application provides quick access to the most important medical information, multilingual support, and a mobile-friendly interface.

### Key Features

- **Medical Card** - comprehensive overview of patient medical history in one place
- **Secure Authentication** - login system with NFC support
- **Mobile-Friendly Interface** - responsive design adapted for mobile devices
- **Multilingual Support** - full support for Polish and English languages
- **Medical Staff Dashboard** - intuitive dashboard for managing patient data
- **Children Mode** - special medical card view adapted for the youngest patients
- **Comprehensive Data** - allergies, chronic diseases, diagnoses, medications, procedures, vaccinations, and examinations

### Tech Stack

- **React 19** - modern UI library
- **TypeScript 5.9** - static typing
- **React Router 7** - application routing
- **Bootstrap 5** - CSS framework
- **Vite 7** - build tool
- **ESLint 9** - code linter

### Project Structure

```
src/
 ├─ componets/           # Feature modules (dashboard, medical card, auth…)
 ├─ assets/              # Static assets + localization tables
 ├─ context/             # Shared providers (e.g., LanguageContext)
 ├─ main.tsx             # App bootstrap with providers + router
 └─ App.tsx              # Top-level routes and navigation
```

#### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** 10+

#### Install Dependencies

```bash
npm install
```

#### Run in Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default).

#### Lint the Codebase

```bash
npm run lint
```

#### Build for Production

```bash
npm run build
```

Artifacts will be placed in the `dist/` directory. You can preview them locally:

```bash
npm run preview
```

#### Deploy to GitHub Pages

The project is configured for GitHub Pages deployment:

```bash
npm run deploy
```

The `predeploy` script will automatically build the project, then publish the contents of the `dist/` directory to the `gh-pages` branch.

### API Documentation

Backend API documentation is available in the repository: [API.md](https://github.com/indyplaygame/LifeLink/blob/main/API.md)

### Links to Backend and Hardware Repositories
- Backend: [LifeLink Backend](https://github.com/indyplaygame/LifeLink/)
- Hardware: [LifeLink Hardware](https://github.com/VicExe0/lifelink-hw)
---


