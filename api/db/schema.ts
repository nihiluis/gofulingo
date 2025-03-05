import { integer, pgTable, timestamp, text, jsonb } from "drizzle-orm/pg-core"

export const vocabularyTable = pgTable("vocabulary", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  languageCode: text().notNull(),
  translationId: integer().references(() => translationTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export type VocabularyDB = typeof vocabularyTable.$inferSelect

export const vocabularyFlashcardTable = pgTable("vocabulary_flashcard", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  vocabularyId: integer().references(() => vocabularyTable.id),
  difficulty: integer().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export const vocabularyFlashcardTranslationTable = pgTable(
  "vocabulary_flashcard_translation",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    flashcardId: integer().references(() => vocabularyFlashcardTable.id),
    translation: text().notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    updatedAt: timestamp().notNull().defaultNow(),
  }
)

export const vocabularyFlashcardLogTable = pgTable("vocabulary_flashcard_log", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  flashcardId: integer().references(() => vocabularyFlashcardTable.id),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export type VocabularyFlashcardDB = typeof vocabularyFlashcardTable.$inferSelect
export type VocabularyFlashcardTranslationDB =
  typeof vocabularyFlashcardTranslationTable.$inferSelect
export type VocabularyFlashcardLogDB =
  typeof vocabularyFlashcardLogTable.$inferSelect

export const translationTable = pgTable("translation", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  languageCode: text().notNull(),
  word: text().notNull(),
  translations: jsonb().notNull().$type<string[]>().default([]),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export type TranslationDB = typeof translationTable.$inferSelect
