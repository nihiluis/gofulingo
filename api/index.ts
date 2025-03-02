import "dotenv/config"
import { createDatabase } from "./db"
import createApp, { applyRoutes } from "./api/createApp"
import { newVocabularyService } from "./lib/vocabulary"
import { createGoogleModel } from "./lib/llm/google"
const app = createApp()

const db = createDatabase()
const llm = createGoogleModel()
export const vocabularyService = newVocabularyService(db, llm)

applyRoutes(app, { model: llm, vocabularyService })

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
