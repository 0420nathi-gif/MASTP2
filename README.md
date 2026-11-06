# {Food Manager}

{Food Manager} is an Expo and React Native app for creating and managing a restaurant menu. It supports individual or batch dish entry, course organization, availability tracking, and menu statistics. Menu data is stored locally on the device.

## Features

- Start with 20 sample dishes across starters, mains, drinks, and desserts. Their average price is R175.
- Add one dish or enter multiple dishes in a batch
- Edit or remove dishes and update their descriptions, courses, and prices
- Search and filter the menu by course and availability
- Mark dishes available or unavailable
- View menu counts and average prices
- Persist menu data on-device with AsyncStorage
- Use themed screens with Expo Router navigation
- Contact kitchen support from the app

## Tech stack

- React Native
- Expo SDK 57.0
- Expo Router
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons and Google Fonts

## Project structure

- `app/` — app screens and Expo Router routes
- `components/` — reusable UI, interaction, and navigation components
- `constants/` — themes, menu operations, categories, and initial sample dishes
- `assets/` — app icons, fonts, and splash assets
- `tests/` — automated tests for menu operations and saved data

## Getting started

### Requirements

- Node.js and npm
- Android Studio, Xcode (macOS), or a web browser for running a platform target

### Install and run

1. Install dependencies:

   npm install

2. Start the development server:

   npm start

3. Choose a platform:

   ```sh
   npm run android
   npm run ios
   npm run web
   ```

### Run tests

```sh
npm test
```

## Notes

Menu data is stored locally on each device and is not synchronized to a server. The initial 20 sample dishes are added to the menu once; saved menu changes remain on the device.
