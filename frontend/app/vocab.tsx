import React from "react"
import { View } from "react-native"
import CenterLayout from "~/components/layout/CenterLayout"
import { TopBar } from "~/components/TopBar"
import VocabularyView from "~/components/vocabulary/VocabularyView"

export default function HomeScreen() {
  return (
    <View className="flex-1">
      <TopBar />
      <CenterLayout>
        <VocabularyView />
      </CenterLayout>
    </View>
  )
}
