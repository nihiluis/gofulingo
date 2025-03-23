import React from "react"
import { View, Pressable } from "react-native"
import { LanguageCode, VocabularySuggestion } from "~/lib/api/vocabulary"
import { GofuText } from "../ui/GofuText"

type VocabularySuggestionsProps = {
  query: string
  languageCode: LanguageCode
  suggestions: VocabularySuggestion[]
  setQuery: (query: string) => void
}

export default function VocabularySuggestions({
  query,
  suggestions,
  setQuery,
}: VocabularySuggestionsProps) {
  if (
    suggestions.length === 0 ||
    // No need to show anything if the suggestion matches the query anyway.
    (suggestions.length === 1 && suggestions[0].title === query)
  ) {
    return null
  }

  return (
    <View className="">
      <GofuText className="text-muted-foreground">Suggestions</GofuText>
      {suggestions.map(suggestion => (
        <VocabularySuggestionItem
          key={suggestion.title}
          title={suggestion.title}
          translations={suggestion.possibleTranslations}
          onPress={() => setQuery(suggestion.title)}
        />
      ))}
    </View>
  )
}

type VocabularySuggestionItemProps = {
  title: string
  translations: string[]
  onPress: () => void
}

function VocabularySuggestionItem({
  title,
  translations,
  onPress,
}: VocabularySuggestionItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="px-4 py-3 border-b border-border active:bg-gray-50">
      <GofuText className="text-foreground">{title}</GofuText>
      {translations.length > 0 && <GofuText className="text-muted-foreground">{translations.join(", ")}</GofuText>}
    </Pressable>
  )
}
