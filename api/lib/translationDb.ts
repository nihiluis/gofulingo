import { translationTable, type TranslationDB } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import { logger } from "./pino"

export class TranslationDBService {
  constructor(private readonly db: PostgresJsDatabase) {}

  async createTranslation(
    translation: Omit<TranslationDB, "id" | "createdAt" | "updatedAt">
  ): Promise<TranslationDB> {
    logger.info({ translation }, "createTranslation")

    const result = await this.db
      .insert(translationTable)
      .values(translation)
      .returning()

    return result[0]
  }

  async createTranslations(
    translations: Omit<TranslationDB, "id" | "createdAt" | "updatedAt">[]
  ): Promise<TranslationDB[]> {
    logger.info({ translations: translations.length }, "createTranslations")

    return await this.db
      .insert(translationTable)
      .values(translations)
      .returning()
  }

  async getTranslation(id: number): Promise<TranslationDB | null> {
    const result = await this.db
      .select()
      .from(translationTable)
      .where(eq(translationTable.id, id))

    if (result.length === 0) {
      return null
    }

    return result[0]
  }
}

export function newTranslationDBService(db: PostgresJsDatabase) {
  return new TranslationDBService(db)
}
