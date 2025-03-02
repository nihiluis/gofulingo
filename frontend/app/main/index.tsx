import React from "react"
import CenterLayout from "~/components/layout/CenterLayout"
import VocabularyView from "~/components/vocabulary/VocabularyView"

export default function HomeScreen() {
  return (
    <CenterLayout>
      <VocabularyView />
    </CenterLayout>
  )
}
