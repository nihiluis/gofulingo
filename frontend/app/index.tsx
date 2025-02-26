import React from "react"
import { View, Text, StyleSheet } from "react-native"
import { TopBar } from "~/components/TopBar"

export default function HomeScreen() {
  return (
    <View>
      <TopBar />
      <Text>Hello World!</Text>
      <Text>Welcome to my app!</Text>
    </View>
  )
}
