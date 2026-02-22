import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { translationTable, vocabularyTable } from "../db/schema"
import { eq } from "drizzle-orm"
import { logger } from "./pino"
import type { LanguageCode } from "./vocabulary"

export type VocabularyAndTranslation = {
  id: number
  title: string
  languageCode: LanguageCode
  translations: string[]
}

export class VocabularyTranslationService {
  constructor(private readonly db: PostgresJsDatabase) {}

  async getVocabularyTranslation(
    id: number
  ): Promise<VocabularyAndTranslation | null> {
    if (!id) {
      throw new Error("Vocabulary ID is required")
    }

    logger.info({ id }, "getVocabularyTranslation")

    const result = await this.db
      .select()
      .from(translationTable)
      .leftJoin(
        vocabularyTable,
        eq(translationTable.id, vocabularyTable.translationId)
      )
      .where(eq(vocabularyTable.id, id))
      .limit(1)

    if (result.length === 0) {
      return null
    }

    const vocabulary = result[0].vocabulary
    const translation = result[0].translation

    if (!vocabulary || !translation) {
      return null
    }

    return {
      id: vocabulary.id,
      title: vocabulary.title,
      languageCode: vocabulary.languageCode as LanguageCode,
      translations: translation.translations,
    }
  }

  async getVocabularyTranslations(
    languageCode: LanguageCode
  ): Promise<VocabularyAndTranslation[]> {
    const result = await this.db
      .select()
      .from(translationTable)
      .leftJoin(
        vocabularyTable,
        eq(translationTable.id, vocabularyTable.translationId)
      )
      .where(eq(vocabularyTable.languageCode, languageCode))

    const validResults = result.filter(
      (
        r
      ): r is typeof r & {
        vocabulary: NonNullable<typeof r.vocabulary>
      } => r.vocabulary !== null
    )

    if (result.length === 0) {
      return []
    }

    return validResults.map(({ vocabulary, translation }) => ({
      id: vocabulary.id,
      title: vocabulary.title,
      languageCode: vocabulary.languageCode as LanguageCode,
      translations: translation?.translations ?? [],
    }))
  }
}

export function newVocabularyTranslationService(db: PostgresJsDatabase) {
  return new VocabularyTranslationService(db)
}
