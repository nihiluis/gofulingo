import { backendClient } from "~/integrations/client"

export type LanguageCode = "fr" | "es" | "en"

export type Vocabulary = {
  id: number
  title: string
  languageCode: LanguageCode
  createdAt: string
  updatedAt: string
}

// Get vocabularies by language code
export async function apiGetVocabularies(
  languageCode: LanguageCode
): Promise<Vocabulary[]> {
  const { data, error } = await backendClient.GET("/api/v1/vocabulary", {
    params: {
      query: {
        languageCode,
      },
    },
  })

  if (error) {
    throw new Error(`Failed to get vocabularies: ${JSON.stringify(error)}`)
  }

  return data?.vocabularies ?? []
}

// Create a new vocabulary
export async function apiCreateVocabulary(
  title: string,
  languageCode: LanguageCode
): Promise<Vocabulary> {
  const { data, error } = await backendClient.POST("/api/v1/vocabulary", {
    body: {
      title,
      languageCode,
    },
  })

  if (error) {
    throw new Error(`Failed to create vocabulary: ${JSON.stringify(error)}`)
  }

  return data?.vocabulary
}

// Get vocabulary by ID
export async function apiGetVocabularyById(
  id: string
): Promise<Vocabulary | null> {
  const { data, error } = await backendClient.GET("/api/v1/vocabulary/{id}", {
    params: {
      path: {
        id,
      },
    },
  })

  if (error) {
    throw new Error(`Failed to get vocabulary: ${JSON.stringify(error)}`)
  }

  return data?.vocabulary ?? null
}

export async function apiDeleteVocabulary(id: number): Promise<void> {
  console.log("Deleting vocabulary", id)
  const { error } = await backendClient.DELETE("/api/v1/vocabulary/{id}", {
    params: {
      path: { id: id.toString() },
    },
  })

  if (error) {
    throw new Error(`Failed to delete vocabulary`)
  }
}

// Update vocabulary by ID
export async function apiUpdateVocabulary(
  id: string,
  title: string,
  languageCode: LanguageCode
): Promise<Vocabulary | null> {
  const { data, error } = await backendClient.PUT("/api/v1/vocabulary/{id}", {
    params: {
      path: {
        id,
      },
    },
    body: {
      title,
      languageCode,
    },
  })

  if (error) {
    throw new Error(`Failed to update vocabulary: ${JSON.stringify(error)}`)
  }

  return data?.vocabulary ?? null
}

// Get vocabulary suggestions
export async function apiGetVocabularySuggestions(
  query: string,
  languageCode: string
): Promise<string[]> {
  const { data, error } = await backendClient.POST(
    "/api/v1/vocabulary/suggestions",
    {
      body: {
        query,
        languageCode,
      },
    }
  )

  if (error) {
    throw new Error(
      `Failed to get vocabulary suggestions: ${JSON.stringify(error)}`
    )
  }

  return Array.from(new Set(data.suggestions))
}
