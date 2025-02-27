import React from "react"
import { Stack } from "expo-router"
import { TopBar } from "~/components/TopBar"
import { useColorScheme } from "~/lib/useColorScheme"
import { NAV_THEME } from "~/lib/constants"

export default function DrawerLayout() {
  const { isDarkColorScheme } = useColorScheme()

  return (
    <>
      <TopBar />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: isDarkColorScheme
              ? NAV_THEME.dark.background
              : NAV_THEME.light.background,
            width: "100%",
          },
        }}
      />
    </>
  )
}
