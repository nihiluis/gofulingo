import { useMutation } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { View, Pressable } from "react-native"
import { apiGetVocabularySuggestions, LanguageCode } from "~/lib/api/vocabulary"
import { GofuText } from "../ui/GofuText"

type VocabularySuggestionsProps = {
  query: string
  languageCode: LanguageCode
  suggestions: string[]
  setQuery: (query: string) => void
}

export default function VocabularySuggestions({
  query,
  languageCode,
  suggestions,
  setQuery,
}: VocabularySuggestionsProps) {
  if (
    suggestions.length === 0 ||
    // No need to show anything if the suggestion matches the query anyway.
    (suggestions.length === 1 && suggestions[0] === query)
  ) {
    return null
  }

  return (
    <View className="">
      <GofuText className="text-muted-foreground">Suggestions</GofuText>
      {suggestions.map(suggestion => (
        <VocabularySuggestionItem
          key={suggestion}
          title={suggestion}
          onPress={() => setQuery(suggestion)}
        />
      ))}
    </View>
  )
}

type VocabularySuggestionItemProps = {
  title: string
  onPress: () => void
}

function VocabularySuggestionItem({
  title,
  onPress,
}: VocabularySuggestionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 border-b border-gray-100 active:bg-gray-50">
      <GofuText className="text-gray-800">{title}</GofuText>
    </Pressable>
  )
}
