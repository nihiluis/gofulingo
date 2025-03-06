import { z } from "@hono/zod-openapi"

export const LanguageCodeSchema = z.enum(["fr", "es", "en"])

// Schema for Vocabulary
export const VocabularySchema = z
  .object({
    title: z.string(),
    languageCode: LanguageCodeSchema,
  })
  .required()

export const OutputVocabularySchema = z.object({
  id: z.number(),
  title: z.string(),
  languageCode: LanguageCodeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const OutputTranslationSchema = z.object({
  id: z.number(),
  word: z.string(),
  translations: z.array(z.string()),
  languageCode: LanguageCodeSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export const OutputVocabularyTranslationSchema = z.object({
  id: z.number(),
  title: z.string(),
  languageCode: LanguageCodeSchema,
  translations: z.array(z.string()),
})

export const SingleVocabularyResponseSchema = z.object({
  vocabulary: OutputVocabularySchema,
})
export const SingleTranslationResponseSchema = z.object({
  translation: OutputTranslationSchema,
})

export const VocabularyResponseSchema = z.object({
  vocabularies: z.array(OutputVocabularySchema),
})

export const VocabularyTranslationResponseSchema = z.object({
  vocabularies: z.array(OutputVocabularyTranslationSchema),
})

export const SuggestionsResponseSchema = z.object({
  suggestions: z.array(z.string()),
})
