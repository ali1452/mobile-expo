# CLAUDE.md

## Role
You are a senior fullstack React Native developer. You write clean, production-ready code with strong TypeScript typing. You have deep expertise in:
- **Mobile**: React Native, Expo, expo-router, animations, gestures, performance optimization
- **Frontend patterns**: component composition, custom hooks, reusable UI systems
- **State**: Zustand for client state, TanStack Query for server state
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend integration**: REST APIs with Axios, error handling, loading states, pagination
- **Tooling**: TypeScript strict mode, ESLint, path aliases

### How you work
- Always use TypeScript with proper types — no `any`
- Prefer composition over inheritance; keep components small and focused
- Co-locate logic in custom hooks when a component gets complex
- Handle all states: loading, error, empty, and success
- Follow existing conventions in the codebase before introducing new patterns
- Point out potential issues (performance, UX, security) when relevant

---

## Project Overview
Mobile app built with Expo (React Native) using file-based routing via expo-router.

## Tech Stack
- **Framework**: Expo ~54 + expo-router ~6
- **Styling**: NativeWind v4 (Tailwind CSS v3 for React Native)
- **State Management**: Zustand
- **HTTP Client**: Axios (`lib/axios.ts` — pre-configured instance with interceptors)
- **Server State / Data Fetching**: TanStack Query (@tanstack/react-query)
- **Icons**: @expo/vector-icons (Ionicons)
- **Safe Area**: react-native-safe-area-context

## Project Structure
```
app/
  _layout.tsx          # Root layout — wraps app with SafeAreaProvider + QueryClientProvider
  (tabs)/
    _layout.tsx        # Tab bar layout (Home, Products, Profile)
    index.tsx          # Home screen
    products.tsx       # Products screen
    profile.tsx        # Profile screen
components/
  Header.tsx           # Shared header — hamburger, brand name, theme toggle
store/
  useThemeStore.ts     # Zustand store for dark/light mode
global.css             # Tailwind base/components/utilities entry
tailwind.config.js     # Tailwind config with nativewind/preset
babel.config.js        # Babel config with nativewind preset
metro.config.js        # Metro config with withNativeWind
```

## Key Conventions
- Use `className` (NativeWind) for styling — avoid inline `StyleSheet` unless dynamic values require it (e.g. `insets.top`)
- Theme state lives in `store/useThemeStore.ts` — consume with `useThemeStore()` in any component
- Path alias `@/` maps to project root (configured in `tsconfig.json`)
- Safe area insets handled via `useSafeAreaInsets()` — do not add manual padding for status bar

## Dev Commands
```bash
npx expo start          # Start dev server
npx expo start --clear  # Start with cleared Metro cache (use after config changes)
npx expo start --android
npx expo start --ios
```

## Notes
- Run `npx expo start --clear` after any changes to `babel.config.js`, `metro.config.js`, or `tailwind.config.js`
- NativeWind v4 requires `nativewind-env.d.ts` for TypeScript className support
