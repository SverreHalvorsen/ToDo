# Shopping List App

A simple and fast shopping list application developed as part of IDATT2506 - Application development for mobile devices at NTNU.

## Description

The app allows users to create multiple lists and manage the items within each list.

### Features

- Create and delete shopping lists
- Quick item entry with enter key
- Mark items as "purchased" by tapping them
- Automatic saving to JSON file
- Item organization: unpurchased items on top, purchased items on bottom

## Technology Stack

- **Framework**: Ionic with Capacitor
- **Frontend**: React
- **Platform**: Android
- **Language**: TypeScript/JavaScript
- **Data Storage**: JSON files via Capacitor Filesystem API

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Android Studio installed
- Android SDK installed

### Setup and Run
```bash
# 1. Install dependencies
npm install

# 2. Build the project
ionic build

# 3. Sync to Android
ionic capacitor sync android

# 4. Open in Android Studio
cd android
studio .
```

Then in Android Studio:
- Wait for Gradle sync to complete
- Select an Android emulator from the dropdown menu
- Run the app on the emulator

## Testing

The app has been tested on:
- Android 15.0 ("VanillaIceCream") x86_64 emulator