import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import type { VocabularyDB } from "../db/schema"
import { vocabularyTable } from "../db/schema"
import { eq } from "drizzle-orm"
import { logger } from "./pino"
import type { LanguageModelV1 } from "ai"
import { z } from "zod"
import { generateObject } from "ai"

export interface VocabularySuggestionResult {
  suggestions: string[]
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

export class VocabularyService {
  constructor(
    private readonly db: PostgresJsDatabase,
    private readonly llm: LanguageModelV1
  ) {}

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
        suggestions: z.array(z.string()),
      }),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have heard the word '${query}' in a conversation. I'm not sure if it's written correctly, please check and suggest potential words in the language (code=${languageCode}). If its a verb, please suggest the infinitive form.`,
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
