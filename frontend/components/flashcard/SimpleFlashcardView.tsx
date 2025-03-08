import { useQuery } from "@tanstack/react-query"
import { useAtomValue } from "jotai"
import { useCallback, useEffect, useState } from "react"
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"
import { apiGetVocabularyTranslations } from "~/lib/api/vocabularyTranslation"
import type { VocabularyAndTranslation } from "~/lib/api/vocabularyTranslation"
import { languageAtom } from "~/state/language"
import { Card } from "../ui/card"

const AnimatedCard = Animated.createAnimatedComponent(Card)

export default function SimpleFlashcardView() {
  const language = useAtomValue(languageAtom)
  const [isFlipped, setIsFlipped] = useState(false)
  const [currentVocabIndex, setCurrentVocabIndex] = useState<number | null>(
    null
  )
  const [lastThreeIndices, setLastThreeIndices] = useState<number[]>([])
  const [flipAnim] = useState(() => new Animated.Value(0))

  const {
    data: vocabulariesResult,
    refetch: refetchVocabularies,
    error: vocabulariesError,
    isPending: isGettingVocabularies,
  } = useQuery({
    queryKey: ["vocabulary", language],
    queryFn: () => apiGetVocabularyTranslations(language.code),
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
    retry: 1,
  })

  const vocabularies = vocabulariesResult ?? []
  const isVocabulariesEmpty = vocabularies.length === 0

  const pickRandomVocab = useCallback(() => {
    if (isVocabulariesEmpty) return

    let newIndex: number
    do {
      newIndex = Math.floor(Math.random() * vocabularies.length)
    } while (lastThreeIndices.includes(newIndex) && vocabularies.length > 3)

    setCurrentVocabIndex(newIndex)
    setLastThreeIndices(prev => {
      const updated = [newIndex, ...prev].slice(0, 3)
      return updated
    })
  }, [vocabularies, lastThreeIndices])

  useEffect(() => {
    if (currentVocabIndex === null && !isVocabulariesEmpty) {
      pickRandomVocab()
    }
  }, [currentVocabIndex, isVocabulariesEmpty, pickRandomVocab])

  const flip = useCallback(() => {
    const toValue = isFlipped ? 0 : 1
    setIsFlipped(!isFlipped)
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start()
  }, [isFlipped, flipAnim])

  const goNext = useCallback(() => {
    setIsFlipped(false)
    flipAnim.setValue(0)
    pickRandomVocab()
  }, [pickRandomVocab, flipAnim])

  if (isGettingVocabularies) {
    return (
      <Card className="p-4 items-center justify-center">
        <Text>Loading...</Text>
      </Card>
    )
  }

  if (vocabulariesError) {
    return (
      <Card className="p-4 items-center justify-center">
        <Text>Error loading vocabularies.</Text>
      </Card>
    )
  }

  if (isVocabulariesEmpty) {
    return (
      <Card className="p-4 items-center justify-center">
        <Text>No vocabularies available.</Text>
      </Card>
    )
  }

  const currentVocab =
    currentVocabIndex !== null ? vocabularies[currentVocabIndex] : null

  if (!currentVocab) return null

  const frontAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "180deg"],
        }),
      },
    ],
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0, 0],
    }),
  }

  const backAnimatedStyle = {
    transform: [
      {
        rotateY: flipAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ["180deg", "360deg"],
        }),
      },
    ],
    opacity: flipAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 0, 1],
    }),
  }

  return (
    <View className="w-full h-64">
      <Pressable onPress={flip} className="w-full h-full">
        <View className="w-full h-full relative">
          <AnimatedCard
            style={[styles.cardFace, frontAnimatedStyle]}
            className="items-center justify-center p-4">
            <Text className="text-2xl font-bold">{currentVocab.title}</Text>
          </AnimatedCard>
          <AnimatedCard
            style={[styles.cardFace, backAnimatedStyle]}
            className="items-center justify-center p-4">
            {currentVocab.translations.map(
              (translation: string, index: number) => (
                <Text key={index} className="text-xl mb-2 text-muted-foreground">
                  {translation}
                  {index < currentVocab.translations.length - 1 && ", "}
                </Text>
              )
            )}
          </AnimatedCard>
        </View>
      </Pressable>
      <Pressable
        onPress={goNext}
        className="absolute bottom-4 right-4 bg-primary rounded-full p-4">
        <Text className="text-white">Next →</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  cardFace: {
    width: "100%",
    height: "100%",
    position: "absolute",
    backfaceVisibility: "hidden",
  },
})
