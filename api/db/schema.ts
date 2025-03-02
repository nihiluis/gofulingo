import { integer, pgTable, timestamp, text, jsonb } from "drizzle-orm/pg-core"

export const vocabularyTable = pgTable("vocabulary", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: text().notNull(),
  languageCode: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
})

export type VocabularyDB = typeof vocabularyTable.$inferSelect
