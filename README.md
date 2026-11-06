# {Food Manager}

{Food Manager} is a cross-platform Expo and React Native app for creating and managing a restaurant menu. Add dishes individually or in batches, organize them by course, track availability, and review menu statistics. Menu data is saved locally on the device.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Using the app](#using-the-app)
- [Menu data and price migration](#menu-data-and-price-migration)
- [Tests](#tests)
- [Support](#support)
- [Implemented changes](#implemented-changes)

## Features

- Branded as **{Food Manager}**, with a splash screen and kitchen support page
- Add one dish or enter multiple dishes in a batch
- Edit and remove dishes, including their descriptions, courses, and prices
- Organize menu items as Starters, Mains, Drinks, or Desserts
- Search dishes and filter by course or availability
- Mark dishes available or unavailable
- View total dish count, average price, and available item count
- Start with 20 sample dishes priced between **R150 and R200**, averaging **R175**
- Persist menu data locally with AsyncStorage
- Use light/dark themed screens, reusable controls, help tips, and app navigation

## Technology

- **Runtime:** React 19, React Native 0.86
- **App platform:** Expo SDK 57
- **Navigation:** Expo Router
- **Local persistence:** React Native AsyncStorage
- **UI:** React Native Safe Area Context, Expo Vector Icons
- **Fonts:** Inter and DM Sans via Expo Google Fonts

## Project structure

- `app/` — Expo Router screens: splash, dish editor, menu list, statistics, contact, and root layout
- `components/` — shared navigation, help tips, and interactive controls
- `constants/` — menu data and operations, storage migration, course categories, and themes
- `assets/` — app icons, adaptive icons, favicon, and splash image
- `tests/` — automated tests for menu operations, prices, and storage migrations
- `app.json` — Expo app configuration
- `package.json` / `package-lock.json` — scripts and locked npm dependencies
- `LICENSE` — license file included in the repository

## Getting started

### Requirements

- Node.js and npm
- For Android: Android Studio and an emulator, or a connected Android device
- For iOS: macOS with Xcode and an iOS simulator, or a connected iOS device
- For web: a current browser

### Install dependencies

```sh
npm install
```

### Start the development server

```sh
npm start
```

With the Expo development server running, use its terminal shortcuts to open the app on an available target, or run one of the platform scripts in another terminal:

```sh
npm run android
npm run ios
npm run web
```

The iOS command requires macOS and Xcode. Android and web commands require their corresponding development environment or browser.

## Using the app

1. On first launch, the menu starts with the 20 bundled sample dishes.
2. Open **Add dish** to create a dish. Enter a name, description, course, and price.
3. Use **Add another dish** to add more forms, then save them together.
4. Open **Menu** to search and filter dishes, edit details, change availability, or delete items.
5. Open **Stats** to see the total dish count, average price, and available-item count.
6. Open **Contact** to prepare an email to kitchen support.

Prices are entered and displayed in South African rand (R).

## Menu data and price migration

Menu data is stored on the device with AsyncStorage. There is no backend account or cloud synchronization, so data is local to each device.

The initial menu contains five sample items for each course: Starter, Main, Drinks, and Dessert. Sample prices range from R150 to R200 and average R175.

Saved menus are versioned so data migrations run only once:

- An unversioned legacy menu has its existing prices increased by 50%, then receives the 20 sample dishes.
- A version 1 saved menu keeps its existing dish prices and receives the 20 sample dishes.
- A version 2 saved menu is loaded without applying either change again.

The migration does not intentionally increase prices on later launches. Dish changes made in the app are saved automatically.

## Tests

```sh
npm test
```

The test suite uses Node.js's built-in test runner and covers menu filtering, adding/updating/removing dishes, availability, statistics, and storage migration behavior.

## Support

Use the Contact screen in the app or email [0420nathi@gmail.com](mailto:0420nathi@gmail.com).

## Implemented changes

- Updated the app identity and visible branding from FRNA to **{Food Manager}**.
- Added multi-dish entry with per-dish validation and batch saving.
- Added menu search, course and availability filters, item editing, removal, and availability controls.
- Added local menu persistence with save status and error feedback.
- Added menu statistics and reusable help and navigation UI.
- Added 20 sample dishes across four courses, with an average price of R175.
- Added versioned migrations for existing saved menus, including a one-time 50% increase for unversioned legacy prices.
- Removed the temporary random-dish button; sample dishes are supplied through initial menu seeding.
