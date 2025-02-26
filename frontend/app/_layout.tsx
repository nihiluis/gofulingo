import "~/global.css"

import {
  Theme,
  ThemeProvider,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native"
import { SplashScreen } from "expo-router"
import { StatusBar } from "expo-status-bar"
import React from "react"
import { Platform } from "react-native"
import { NAV_THEME } from "~/lib/constants"
import { useColorScheme } from "~/lib/useColorScheme"
import { Drawer } from "expo-router/drawer"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Home } from "~/lib/icons/Home"
import { TopBar } from "~/components/TopBar"

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router"
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const hasMounted = React.useRef(false)
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current) {
      return
    }

    if (Platform.OS === "web") {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add("bg-background")
    }
    setIsColorSchemeLoaded(true)
    hasMounted.current = true
  }, [])

  if (!isColorSchemeLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Drawer
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.card
                : NAV_THEME.light.card,
            },
            headerTintColor: isDarkColorScheme
              ? NAV_THEME.dark.text
              : NAV_THEME.light.text,
            drawerStyle: {
              backgroundColor: isDarkColorScheme
                ? NAV_THEME.dark.card
                : NAV_THEME.light.card,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
            },
            drawerActiveTintColor: isDarkColorScheme
              ? NAV_THEME.dark.primary
              : NAV_THEME.light.primary,
            drawerInactiveTintColor: isDarkColorScheme
              ? NAV_THEME.dark.text
              : NAV_THEME.light.text,
          }}>
          <Drawer.Screen
            name="index"
            options={{
              drawerLabel: "Home",
              headerShown: false,
              drawerIcon: ({ color }) => <Home size={24} color={color} />,
            }}
          />
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  )
}

const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect
