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

export const SingleVocabularyResponseSchema = z.object({
  vocabulary: OutputVocabularySchema,
})

export const VocabularyResponseSchema = z.object({
  vocabularies: z.array(OutputVocabularySchema),
})

export const SuggestionsResponseSchema = z.object({
  suggestions: z.array(z.string()),
})
