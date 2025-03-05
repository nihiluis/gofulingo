import type { LanguageModelV1 } from "ai"
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js"
import {
  vocabularyFlashcardTable,
  type VocabularyFlashcardDB,
} from "../db/schema"
export class VocabularyFlashcardService {
  constructor(
    private readonly db: PostgresJsDatabase,
    private readonly llm: LanguageModelV1
  ) {}

  async createVocabularyFlashcard(
    vocabularyId: number,
    difficulty: number
  ): Promise<VocabularyFlashcardDB> {
    const flashcard = await this.db
      .insert(vocabularyFlashcardTable)
      .values({
        vocabularyId,
        difficulty,
      })
      .returning()

    return flashcard[0]
  }
}

export function newVocabularyFlashcardService(
  db: PostgresJsDatabase,
  llm: LanguageModelV1
) {
  return new VocabularyFlashcardService(db, llm)
}
