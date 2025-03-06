import { backendClient } from "~/integrations/client"

export type LanguageCode = "fr" | "es" | "en"

export type VocabularyAndTranslation = {
  id: number
  title: string
  languageCode: LanguageCode
  translations: string[]
}

export async function apiGetVocabularyTranslations(
  languageCode: LanguageCode
): Promise<VocabularyAndTranslation[]> {
  const { data, error } = await backendClient.GET(
    "/api/v1/vocabulary/translation",
    {
      params: {
        query: {
          languageCode,
        },
      },
    }
  )

  if (error) {
    throw new Error(`Failed to get vocabularies: ${JSON.stringify(error)}`)
  }

  console.log("data", data)

  return data?.vocabularies ?? []
}
