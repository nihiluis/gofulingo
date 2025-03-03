import React from "react"
import { View } from "react-native"
import CenterLayout from "~/components/layout/CenterLayout"
import { TopBar } from "~/components/TopBar"
import { GofuText } from "~/components/ui/GofuText"

export default function FlashcardsScreen() {
  return (
    <View className="flex-1">
      <TopBar />
      <CenterLayout>
        <GofuText>Flashcards</GofuText>
      </CenterLayout>
    </View>
  )
}
