# {Food Manager}

{Food Manager} is a lightweight Expo + React Native app for managing a restaurant or kitchen menu. It lets users add, edit, price, and organize dishes while keeping menu data saved locally on the device.

## Features

- Add and edit menu items
- Set dish name, description, course, and price
- Organize items by course type
- Toggle menu item availability
- View menu totals and counts
- Save menu state locally with AsyncStorage
- Modern mobile UI with Expo Router and themed styling

## Tech stack

- React Native
- Expo SDK 57
- Expo Router
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons

## Project structure

- app/ — screens and navigation routes
- components/ — reusable UI and interaction components
- constants/ — theme, menu data, and categories
- assets/ — app icons and splash assets
- tests/ — project test files

## Getting started

1. Install dependencies:

   npm install

2. Start the Expo development server:

   npm start

3. Run the app on a platform:

   npm run android
   npm run ios
   npm run web

## Notes

This app is intended as a simple menu-management tool for food businesses, cafes, or personal kitchen planning. It is built for quick local workflow usage and easy extension.
