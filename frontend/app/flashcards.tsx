import React from "react"
import { View } from "react-native"
import CenterLayout from "~/components/layout/CenterLayout"
import { TopBar } from "~/components/TopBar"
import FlashcardView from "~/components/flashcard/FlashcardView"

export default function FlashcardsScreen() {
  return (
    <View className="flex-1">
      <TopBar />
      <CenterLayout>
        <FlashcardView />
      </CenterLayout>
    </View>
  )
}
