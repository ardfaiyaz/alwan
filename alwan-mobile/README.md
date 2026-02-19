# Alwan Mobile App

The core mobile application for Alwan Microfinance, providing members with instant access to financial services, loan applications, and account management.

---

## 📋 Overview

This is the mobile application built with React Native and Expo, featuring a native experience for iOS and Android. It serves as the primary interface for Alwan members to manage their finances on the go.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (installed globally or via npx)
- **iOS Simulator** (Mac only) or **Android Studio** for emulators
- **Expo Go** app on your physical device (for testing)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials
```

### Development

```bash
# Start Expo development server
npm start

# Run on Android emulator/device
npm run android

# Run on iOS simulator (Mac only)
npm run ios

# Run in web browser
npm run web

# Reset project (clear cache)
npm run reset-project

# Run linter
npm run lint
```

---

## 🏗️ Project Structure

```
alwan-mobile/
├── app/                       # Expo Router screens
│   ├── (tabs)/               # Tab-based navigation
│   │   ├── index.tsx         # Home tab
│   │   ├── explore.tsx       # Explore tab
│   │   └── ...
│   ├── _layout.tsx           # Root layout
│   └── +not-found.tsx        # 404 screen
├── components/               # React Native components
│   ├── ui/                  # Reusable UI components
│   └── ...
├── assets/                   # Static assets
│   ├── fonts/               # Custom fonts
│   └── images/              # Image files
├── constants/               # App constants
├── hooks/                   # Custom React hooks
├── scripts/                 # Utility scripts
├── .env                     # Environment variables (not in git)
├── app.json                 # Expo configuration
├── expo-env.d.ts           # Expo TypeScript definitions
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

---

## 🛠️ Technology Stack

### Core Framework
- **Expo** 54.0.33 - React Native development platform
- **React Native** 0.81.5 - Mobile UI framework
- **React** 19.1.0 - UI library
- **TypeScript** 5.9.2 - Type safety

### Navigation
- **Expo Router** 6.0.23 - File-based routing
- **React Navigation** 7.1.8 - Navigation library
  - `@react-navigation/bottom-tabs` 7.4.0
  - `@react-navigation/elements` 2.6.3
  - `@react-navigation/native` 7.1.8

### Styling
- **NativeWind** 4.2.1 - Tailwind CSS for React Native
- **Tailwind CSS** 3.4.19 - Utility-first CSS
- **react-native-css-interop** 0.2.1 - CSS interoperability

### UI Components & Animations
- **React Native Reanimated** 4.1.1 - Smooth animations
- **React Native Gesture Handler** 2.28.0 - Touch gestures
- **React Native Screens** 4.16.0 - Native screen optimization
- **Expo Symbols** 1.0.8 - SF Symbols support
- **Expo Vector Icons** 15.0.3 - Icon library
- **Expo Linear Gradient** 15.0.8 - Gradient backgrounds

### Data & Authentication
- **Supabase** 2.95.3 - Database and authentication
- **react-native-url-polyfill** 3.0.0 - URL polyfill for React Native

### File & Media Handling
- **Expo Document Picker** 14.0.8 - File selection
- **Expo File System** 19.0.21 - File system access
- **Expo Image** 3.0.11 - Optimized image component
- **base64-arraybuffer** 1.0.2 - Base64 encoding

### Device Features
- **Expo Haptics** 15.0.8 - Haptic feedback
- **Expo Status Bar** 3.0.9 - Status bar control
- **Expo System UI** 6.0.9 - System UI customization
- **Expo Splash Screen** 31.0.13 - Splash screen management
- **React Native Safe Area Context** 5.6.0 - Safe area handling

### Utilities
- **Expo Constants** 18.0.13 - App constants
- **Expo Font** 14.0.11 - Custom fonts
- **Expo Linking** 8.0.11 - Deep linking
- **Expo Web Browser** 15.0.10 - In-app browser
- **react-native-worklets** 0.5.1 - JavaScript worklets

### Development Tools
- **ESLint** 9.25.0 - Code linting
- **eslint-config-expo** 10.0.0 - Expo ESLint config

---

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎨 Key Features

### User Experience
- **Tab Navigation**: Easy access to main features
- **Native Feel**: Platform-specific UI patterns
- **Smooth Animations**: 60fps animations with Reanimated
- **Haptic Feedback**: Touch feedback for better UX
- **Gesture Support**: Swipe, pinch, and other native gestures

### Functionality
- **Loan Applications**: Apply for loans with document upload
- **Account Management**: View balance, transactions, and history
- **Document Upload**: Pick and upload required documents
- **Real-time Updates**: Live data synchronization with Supabase
- **Offline Support**: Basic functionality without internet

### Design
- **NativeWind Styling**: Tailwind CSS utility classes
- **Custom Fonts**: Brand-specific typography
- **Optimized Images**: Fast loading with Expo Image
- **Responsive Layout**: Adapts to different screen sizes
- **Dark Mode**: Signature Alwan dark theme

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in web browser |
| `npm run reset-project` | Clear cache and reset |
| `npm run lint` | Run ESLint |

---

## 📱 Platform Support

| Platform | Support | Notes |
|----------|---------|-------|
| iOS | ✅ Full | Requires Mac for development |
| Android | ✅ Full | Works on all platforms |
| Web | ✅ Limited | Basic functionality only |

---

## 🔗 Integration

### Supabase
The mobile app integrates with Supabase for:
- User authentication (sign up, login, logout)
- Database queries (members, loans, transactions)
- Real-time subscriptions (live updates)
- File storage (document uploads)

### Expo Services
- **Expo Go**: Quick testing on physical devices
- **EAS Build**: Cloud-based builds for production
- **EAS Submit**: App store submission
- **EAS Update**: Over-the-air updates

---

## 🚢 Deployment

### Development Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Create development build
eas build --profile development --platform android
eas build --profile development --platform ios
```

### Production Build
```bash
# Build for production
eas build --profile production --platform android
eas build --profile production --platform ios

# Submit to stores
eas submit --platform android
eas submit --platform ios
```

---

## 🎯 Development Guidelines

### Code Style
- Use TypeScript for all new files
- Follow ESLint rules
- Use NativeWind for styling
- Keep components small and focused
- Use Expo Router for navigation

### Component Structure
```tsx
import { View, Text } from 'react-native'

interface MyComponentProps {
  title: string
  // ... other props
}

export function MyComponent({ title }: MyComponentProps) {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-lg font-bold">{title}</Text>
    </View>
  )
}
```

### Naming Conventions
- Components: PascalCase (e.g., `Button.tsx`)
- Screens: PascalCase (e.g., `HomeScreen.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_URL`)

### File Organization
- Screens go in `app/` directory
- Reusable components go in `components/`
- Shared utilities go in `lib/` or `utils/`
- Constants go in `constants/`
- Custom hooks go in `hooks/`

---

## 🐛 Troubleshooting

### Common Issues

**Metro bundler issues:**
```bash
# Clear cache and restart
npm start -- --clear
```

**Expo Go not connecting:**
- Ensure device and computer are on the same network
- Try scanning QR code again
- Restart Expo Go app

**Build errors:**
```bash
# Clear node modules and reinstall
rm -rf node_modules
npm install

# Clear Expo cache
npx expo start --clear
```

**iOS simulator not opening:**
```bash
# Open simulator manually
open -a Simulator

# Then run
npm run ios
```

**Android emulator issues:**
- Ensure Android Studio is installed
- Check that emulator is running
- Verify ANDROID_HOME environment variable

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Supabase React Native Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)

---

## 🤝 Contributing

This is part of the Alwan monorepo. See the [root README](../README.md) for contribution guidelines.

---

**Part of the Alwan Microfinance Platform** | [Back to Root](../README.md)
