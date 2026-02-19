# Alwan Mobile – Mobile Application

The core mobile experience for Alwan Microfinance members. Built with React Native and Expo for cross-platform iOS and Android support.

---

## 📋 Overview

Alwan Mobile is the primary interface for microfinance members to manage their accounts, apply for loans, make payments, and track their financial activities. The app provides a seamless, native experience with offline capabilities and real-time synchronization.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed globally or via npx)
- For iOS: Xcode and iOS Simulator
- For Android: Android Studio and Android Emulator
- Expo Go app (for testing on physical devices)

### Installation

1. **Navigate to the mobile directory**
   ```bash
   cd alwan-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root of `alwan-mobile`:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on your preferred platform**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Scan QR code with Expo Go app for physical device

---

## 📁 Project Structure

```
alwan-mobile/
├── app/                       # Expo Router screens
│   ├── (tabs)/               # Tab-based navigation
│   │   ├── index.tsx         # Home screen
│   │   ├── loans.tsx         # Loans screen
│   │   ├── payments.tsx      # Payments screen
│   │   └── profile.tsx       # Profile screen
│   ├── _layout.tsx           # Root layout
│   └── +not-found.tsx        # 404 screen
├── components/               # React Native components
│   ├── ui/                   # UI primitives
│   ├── navigation/           # Navigation components
│   └── ThemedText.tsx        # Themed components
├── assets/                   # Static assets
│   ├── fonts/                # Custom fonts
│   └── images/               # Image assets
├── constants/                # App constants
│   └── Colors.ts             # Color definitions
├── hooks/                    # Custom React hooks
│   └── useSupabase.ts        # Supabase hooks
├── scripts/                  # Utility scripts
│   └── reset-project.js      # Project reset script
├── .env                      # Environment variables (create this)
├── app.json                  # Expo configuration
├── expo-router.config.js     # Router configuration
├── tailwind.config.js        # NativeWind configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Dependencies and scripts
```

---

## 🛠️ Technology Stack

### Core Framework
- **Expo 54.0.33**: React Native development platform
- **React Native 0.81.5**: Mobile UI framework
- **React 19.1.0**: UI library
- **TypeScript 5.9.2**: Type safety

### Navigation & Routing
- **Expo Router 6.0.23**: File-based routing
- **@react-navigation/native 7.1.8**: Navigation library
- **@react-navigation/bottom-tabs 7.4.0**: Tab navigation
- **@react-navigation/elements 2.6.3**: Navigation elements

### Styling
- **NativeWind 4.2.1**: Tailwind CSS for React Native
- **Tailwind CSS 3.4.19**: Utility-first CSS
- **react-native-css-interop 0.2.1**: CSS interoperability
- **Expo Linear Gradient 15.0.8**: Gradient components

### UI Components & Icons
- **Expo Symbols 1.0.8**: Symbol icons
- **@expo/vector-icons 15.0.3**: Icon library
- **Expo Image 3.0.11**: Optimized image component

### Animations & Gestures
- **React Native Reanimated 4.1.1**: Smooth animations
- **React Native Gesture Handler 2.28.0**: Touch gestures
- **react-native-worklets 0.5.1**: JavaScript worklets

### Backend & Data
- **@supabase/supabase-js 2.95.3**: Supabase client
- **react-native-url-polyfill 3.0.0**: URL polyfill for React Native

### File Handling
- **Expo Document Picker 14.0.8**: Document selection
- **Expo File System 19.0.21**: File system access
- **base64-arraybuffer 1.0.2**: Base64 encoding

### Device Features
- **Expo Haptics 15.0.8**: Haptic feedback
- **Expo Status Bar 3.0.9**: Status bar control
- **Expo System UI 6.0.9**: System UI control
- **Expo Web Browser 15.0.10**: In-app browser
- **Expo Linking 8.0.11**: Deep linking

### Development Tools
- **Expo Constants 18.0.13**: App constants
- **Expo Font 14.0.11**: Custom fonts
- **Expo Splash Screen 31.0.13**: Splash screen
- **React Native Safe Area Context 5.6.0**: Safe area handling
- **React Native Screens 4.16.0**: Native screen optimization

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint for code quality |
| `npm run reset-project` | Reset project to blank state |

---

## 🎨 Key Features

### Member Dashboard
- Account overview and balance
- Recent transactions
- Loan status and payment schedule
- Quick actions (apply for loan, make payment)

### Loan Management
- Browse available loan products
- Submit loan applications with document upload
- Track application status
- View loan history and details
- Payment reminders and notifications

### Payments & Collections
- Make loan payments
- View payment history
- Weekly collection schedules
- Payment receipts and confirmations

### Profile & Settings
- Personal information management
- Document uploads (ID, proof of income)
- Notification preferences
- Security settings
- Language selection

### Design Features
- **Native Feel**: Platform-specific UI patterns
- **Offline Support**: Core features work without internet
- **Real-time Sync**: Instant updates via Supabase
- **Haptic Feedback**: Touch feedback for actions
- **Smooth Animations**: 60fps animations with Reanimated
- **Optimized Images**: Fast loading with Expo Image

---

## 🌐 Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 📱 Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| iOS | ✅ Full | iOS 13.4+ |
| Android | ✅ Full | Android 5.0+ (API 21+) |
| Web | ⚠️ Limited | For testing only |

---

## 🔧 Configuration Files

### app.json
Expo configuration including app name, version, icons, splash screen, and platform-specific settings.

### tailwind.config.js
NativeWind configuration with custom colors and design tokens matching the Alwan brand.

### tsconfig.json
TypeScript compiler options optimized for React Native and Expo.

---

## 🚢 Building for Production

### Android APK/AAB

```bash
# Build APK for testing
npx expo build:android -t apk

# Build AAB for Play Store
npx expo build:android -t app-bundle
```

### iOS IPA

```bash
# Build for App Store
npx expo build:ios -t archive
```

### Using EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

## 🧪 Testing

### On Physical Device

1. Install Expo Go from App Store or Play Store
2. Run `npm start`
3. Scan QR code with Expo Go

### On Emulator/Simulator

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android
```

---

## 🔗 Integration with Other Projects

This mobile app integrates with:
- **alwan-admin**: Backend data management
- **alwan-web**: Consistent branding and user experience
- **Supabase**: Real-time database and authentication

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test on both iOS and Android
4. Submit a pull request

---

## 📄 License

ISC License

---

## 🆘 Support

For issues specific to the mobile app:
1. Check the main repository README
2. Review existing GitHub issues
3. Create a new issue with "mobile:" prefix

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)

---

**Part of the Alwan Microfinance Ecosystem**
