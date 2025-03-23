import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import type { VocabularyDB } from "../db/schema"
import { vocabularyTable } from "../db/schema"
import { eq } from "drizzle-orm"
import { logger } from "./pino"
import type { LanguageModelV1 } from "ai"
import { z } from "zod"
import { generateObject } from "ai"

export interface VocabularySuggestionResult {
  suggestions: Suggestion[]
}

export type LanguageCode = "fr" | "es" | "en"

export type Vocabulary = {
  id: number
  title: string
  languageCode: LanguageCode
  translationId: number | null
  createdAt: Date
  updatedAt: Date
}

export const SuggestionSchema = z.object({
  title: z.string(),
  possibleTranslations: z.array(z.string()),
})

type Suggestion = z.infer<typeof SuggestionSchema>

export class VocabularyService {
  constructor(
    private readonly db: PostgresJsDatabase,
    private readonly llm: LanguageModelV1
  ) { }

  async createVocabulary(
    vocabulary: Omit<VocabularyDB, "id" | "createdAt" | "updatedAt">
  ): Promise<Vocabulary> {
    logger.info(`Creating vocabulary`, { vocabulary })

    const result = await this.db
      .insert(vocabularyTable)
      .values(vocabulary)
      .returning()

    return {
      ...result[0],
      languageCode: result[0].languageCode as LanguageCode,
    }
  }

  async retrieveVocabularySuggestions(
    query: string,
    languageCode: string
  ): Promise<VocabularySuggestionResult> {
    logger.info(`Retrieving vocabulary suggestions for ${query}`, {
      languageCode,
    })

    const result = await generateObject({
      model: this.llm,
      schema: z.object({
        suggestions: z.array(SuggestionSchema),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have heard '${query}' (input) in a conversation. I'm not sure if it's written correctly, please check and suggest potential words or expressions in this language (code=${languageCode}). If it the input consists of only a verb, please suggest the infinitive form. For example, inputting 'nage' should become 'nager'. If the input consists of only a noun, prefix the article. 'pomme' becomes 'la pomme'. The suggestion should also include all possible translations that would be used in modern day conversation or articles.`,
            },
          ],
        },
      ],
    })

    if (!result) {
      throw new Error("generateImageUnderstanding result is empty")
    }

    return result.object
  }

  async getVocabulary(id: number): Promise<Vocabulary | null> {
    logger.info(`Getting vocabulary with id ${id}`)

    const result = await this.db
      .select()
      .from(vocabularyTable)
      .where(eq(vocabularyTable.id, id))

    if (result.length === 0) {
      return null
    }

    return {
      ...result[0],
      languageCode: result[0].languageCode as LanguageCode,
    }
  }

  async getVocabularies(languageCode: LanguageCode): Promise<Vocabulary[]> {
    logger.info(`Getting vocabularies with language code`, { languageCode })

    return this.db
      .select()
      .from(vocabularyTable)
      .where(eq(vocabularyTable.languageCode, languageCode))
      .then(rows =>
        rows.map(row => ({
          ...row,
          languageCode: row.languageCode as LanguageCode,
        }))
      )
  }

  async updateVocabulary(
    id: number,
    vocabulary: Partial<Omit<VocabularyDB, "id" | "createdAt" | "updatedAt">>
  ): Promise<void> {
    logger.info(`Updating vocabulary with id ${id}`, { vocabulary })
    await this.db
      .update(vocabularyTable)
      .set(vocabulary)
      .where(eq(vocabularyTable.id, id))
  }

  async deleteVocabulary(id: number): Promise<void> {
    logger.info(`Deleting vocabulary with id ${id}`)
    await this.db.delete(vocabularyTable).where(eq(vocabularyTable.id, id))
  }
}

export function newVocabularyService(
  db: PostgresJsDatabase,
  llm: LanguageModelV1
) {
  return new VocabularyService(db, llm)
}
