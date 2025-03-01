import { useAtomValue } from "jotai"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { languageAtom } from "~/state/language"
import apiGetVocabulary, { VocabularyList as VocabularyListType } from "~/lib/api/getVocabulary"
import VocabularyList from "./VocabularyList"
import { Alert } from "react-native"

export default function Vocabulary() {
  const language = useAtomValue(languageAtom)
  const queryClient = useQueryClient()
  
  const { data: vocabulary, isLoading, error } = useQuery({
    queryKey: ["vocabulary", language],
    queryFn: () => apiGetVocabulary(language),
  })

  // Mock mutations for demonstration purposes
  // In a real app, these would call actual API endpoints
  const handleAddVocabulary = () => {
    Alert.prompt(
      "Add Vocabulary",
      "Enter new vocabulary word:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add",
          onPress: (text?: string) => {
            if (text && text.trim()) {
              // In a real app, this would be an API call
              const newItem = {
                id: Date.now(), // temporary ID
                text: text.trim(),
              }
              
              // Optimistically update the cache
              queryClient.setQueryData<VocabularyListType>(["vocabulary", language], (old) => 
                old ? [...old, newItem] : [newItem]
              )
            }
          }
        }
      ]
    )
  }

  const handleEditVocabulary = (id: number, currentText: string) => {
    Alert.prompt(
      "Edit Vocabulary",
      "Update vocabulary word:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: (newText?: string) => {
            if (newText && newText.trim()) {
              // In a real app, this would be an API call
              
              // Optimistically update the cache
              queryClient.setQueryData<VocabularyListType>(["vocabulary", language], (old) => {
                if (!old) return old
                return old.map(item => 
                  item.id === id ? { ...item, text: newText.trim() } : item
                )
              })
            }
          }
        }
      ],
      "plain-text",
      currentText
    )
  }

  const handleDeleteVocabulary = (id: number) => {
    Alert.alert(
      "Delete Vocabulary",
      "Are you sure you want to delete this vocabulary item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // In a real app, this would be an API call
            
            // Optimistically update the cache
            queryClient.setQueryData<VocabularyListType>(["vocabulary", language], (old) => {
              if (!old) return old
              return old.filter(item => item.id !== id)
            })
          }
        }
      ]
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading vocabulary</div>
  }

  return (
    <VocabularyList
      vocabulary={vocabulary || []}
      onAddVocabulary={handleAddVocabulary}
      onEditVocabulary={handleEditVocabulary}
      onDeleteVocabulary={handleDeleteVocabulary}
    />
  )
}
