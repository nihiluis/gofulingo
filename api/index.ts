import "dotenv/config"
import { createDatabase } from "./db"
import createApp, { applyRoutes } from "./api/createApp"
import { newVocabularyService } from "./lib/vocabulary"
import { createGoogleModel } from "./lib/llm/google"
import { newVocabularyFlashcardService } from "./lib/vocabularyFlashcard"
import { newLLMTranslatorService } from "./lib/translator"
import { newTranslationDBService } from "./lib/translationDb"
import { newVocabularyTranslationService } from "./lib/vocabularyTranslation"

const app = createApp()

const db = createDatabase()
const llm = createGoogleModel()
export const vocabularyService = newVocabularyService(db, llm)
export const vocabularyFlashcardService = newVocabularyFlashcardService(db, llm)
export const translatorService = newLLMTranslatorService(db, llm)
export const translationDbService = newTranslationDBService(db)
export const vocabularyTranslationService = newVocabularyTranslationService(db)

applyRoutes(app, {
  model: llm,
  vocabularyService,
  translatorService,
  translationDbService,
  vocabularyTranslationService,
})

app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
})

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
}
