import { useAtomValue } from "jotai"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { languageAtom } from "~/state/language"
import VocabularyList from "./VocabularyList"
import { apiGetVocabularies, Vocabulary } from "~/lib/api/vocabulary"

export default function VocabularyView() {
  const language = useAtomValue(languageAtom)
  const queryClient = useQueryClient()

  function handleAddVocabulary(title: string) {
    console.log("handleAddVocabulary", title)
  }

  function handleEditVocabulary(id: number, title: string) {
    console.log("handleEditVocabulary", id, title)
  }

  function handleDeleteVocabulary(id: number) {
    console.log("handleDeleteVocabulary", id)
  }

  return (
    <VocabularyList
      onAddVocabulary={handleAddVocabulary}
      onEditVocabulary={handleEditVocabulary}
      onDeleteVocabulary={handleDeleteVocabulary}
    />
  )
}
