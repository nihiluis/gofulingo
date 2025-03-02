import React, { useEffect, useState, useMemo } from "react"
import { View, Text, FlatList, Pressable } from "react-native"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import VocabularyItem, { VocabularyItemProps } from "./VocabularyItem"
import {
  apiCreateVocabulary,
  apiDeleteVocabulary,
  apiGetVocabularies,
  apiGetVocabularySuggestions,
  LanguageCode,
  Vocabulary,
} from "~/lib/api/vocabulary"
import { useMutation, useQuery } from "@tanstack/react-query"
import { languageAtom } from "~/state/language"
import { useAtomValue } from "jotai"
import { CircleHelp } from "~/lib/icons/CircleHelp"
import VocabularySuggestions from "./VocabularySuggestions"
import { GofuText } from "../ui/GofuText"
import { fuzzySearch } from "~/lib/fuzzySearch"

type VocabularyListProps = {
  onAddVocabulary: (title: string) => void
  onEditVocabulary: (id: number, title: string) => void
  onDeleteVocabulary: (id: number) => void
}

export default function VocabularyList({
  onAddVocabulary,
  onEditVocabulary,
  onDeleteVocabulary,
}: VocabularyListProps) {
  const language = useAtomValue(languageAtom)
  const languageCode = language.code
  const [searchQuery, setSearchQuery] = useState("")
  const [customSuggestionsError, setCustomSuggestionsError] = useState<
    string | null
  >(null)

  const { data: vocabulariesResult, refetch: refetchVocabularies } = useQuery({
    queryKey: ["vocabulary", language],
    queryFn: () => apiGetVocabularies(language.code),
  })

  const vocabularies = vocabulariesResult || []

  const filteredVocabulary = useMemo(
    () =>
      searchQuery.length > 0
        ? fuzzySearch(vocabularies, "title", searchQuery)
        : vocabularies,
    [vocabularies, searchQuery]
  )

  const {
    mutate: getSuggestions,
    data: suggestions,
    isPending: isGettingSuggestions,
    reset: resetSuggestions,
    error: mutateSuggestionsError,
  } = useMutation({
    mutationFn: ({
      query,
      languageCode,
    }: {
      query: string
      languageCode: string
    }) => apiGetVocabularySuggestions(query, languageCode),
  })

  const {
    mutate: addVocabulary,
    data: addVocabularyData,
    isPending: isAddingVocabulary,
    reset: resetAddVocabulary,
    error: mutateAddVocabularyError,
  } = useMutation({
    mutationFn: ({
      query,
      languageCode,
    }: {
      query: string
      languageCode: LanguageCode
    }) => apiCreateVocabulary(query, languageCode),
    onSuccess: () => {
      refetchVocabularies()
    },
  })

  useEffect(() => {
    resetSuggestions()
  }, [searchQuery, languageCode])

  const isAddingVocabularyDisabled = useMemo(() => {
    return (
      searchQuery.length < 3 ||
      isAddingVocabulary ||
      isGettingSuggestions ||
      vocabularies.some(vocabulary => vocabulary.title === searchQuery)
    )
  }, [isAddingVocabulary, isGettingSuggestions, vocabularies, searchQuery])

  const { mutate: deleteVocabulary, isPending: isDeleting } = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      await apiDeleteVocabulary(id)
      await refetchVocabularies()

      return Promise.resolve()
    },
  })

  const suggestionsError =
    mutateSuggestionsError?.message ?? customSuggestionsError ?? ""

  return (
    <View className="flex-1 gap-4 w-full max-w-3xl">
      <View className="flex-row items-center gap-2">
        <Input
          className="flex-1"
          placeholder="Search vocabulary..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Button
          variant="outline"
          isLoading={isGettingSuggestions}
          onPress={() => {
            if (searchQuery.length >= 3) {
              setCustomSuggestionsError("")
              getSuggestions({
                query: searchQuery,
                languageCode: language.code,
              })
            } else {
              setCustomSuggestionsError("Please enter at least 3 characters.")
            }
          }}>
          <GofuText>Suggest</GofuText>
        </Button>
        <Button
          variant="default"
          disabled={isAddingVocabularyDisabled}
          isLoading={isAddingVocabulary}
          onPress={() => addVocabulary({ query: searchQuery, languageCode })}>
          <GofuText className="text-primary-foreground">Add</GofuText>
        </Button>
      </View>
      {suggestionsError.length > 0 && (
        <GofuText className="text-destructive">{suggestionsError}</GofuText>
      )}
      <VocabularySuggestions
        query={searchQuery}
        setQuery={setSearchQuery}
        languageCode={languageCode}
        suggestions={suggestions || []}
      />
      <View className="flex-1">
        <GofuText className="text-muted-foreground">Vocab</GofuText>
        {filteredVocabulary.length === 0 && (
          <GofuText className="text-muted-foreground text-center">
            {vocabularies.length === 0
              ? "No vocabulary items found. Add your first one!"
              : "No results found for your search."}
          </GofuText>
        )}
        <FlatList
          data={filteredVocabulary}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <VocabularyItem
              id={item.id}
              text={item.title}
              onEdit={onEditVocabulary}
              onDelete={() => deleteVocabulary({ id: item.id })}
            />
          )}
        />
      </View>
    </View>
  )
}
