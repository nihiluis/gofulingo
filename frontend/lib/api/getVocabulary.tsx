import axios from "axios"
import { z } from "zod"
import { Language } from "../constants"

export const VocabularySchema = z.object({
  vocabulary: z.array(
    z.object({
      id: z.number(),
      text: z.string(),
    })
  ),
})

export type VocabularyList = z.infer<typeof VocabularySchema>["vocabulary"]

export default async function apiGetVocabulary(
  language: Language
): Promise<VocabularyList> {
  const response = {
    data: {
      vocabulary: [
        { id: 1, text: "bonjour" },
        { id: 2, text: "bonsoir" },
        { id: 3, text: "bonne nuit" },
        { id: 4, text: "bonne journée" },
        { id: 5, text: "bonne soirée" },
      ],
    },
  }
  return response.data.vocabulary
}
