import React from "react"
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"
import { useState } from "react"
import SimpleFlashcardView from "./SimpleFlashcardView"
import { Text, View } from "react-native"

export default function FlashcardView() {
  const [mode, setMode] = useState<string>("simple")

  return (
    <>
      <View>
        <ToggleGroup
          type="single"
          className="mb-4"
          value={mode}
          onValueChange={value => {
            if (!value) {
              return
            }
            setMode(value)
          }}>
          <ToggleGroupItem value="simple">
            <Text>Simple</Text>
          </ToggleGroupItem>
          <ToggleGroupItem value="sentences" disabled>
            <Text>Sentences</Text>
          </ToggleGroupItem>
        </ToggleGroup>
      </View>
      <View className="mt-2 max-w-screen-sm mx-auto w-full items-center justify-center px-4">
        {mode === "simple" && <SimpleFlashcardView />}
      </View>
    </>
  )
}
