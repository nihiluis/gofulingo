import { OpenAPIHono } from "@hono/zod-openapi"
import { logger } from "hono/logger"
import { cors } from "hono/cors"
import { pingHandler, pingRoute } from "./ping"
import { errorHandler, notFoundHandler } from "./utilHandlers"
import type { LanguageModelV1 } from "ai"
import { VocabularyService } from "../lib/vocabulary"
import {
  getVocabularyRoute,
  getVocabularyHandler,
  createVocabularyRoute,
  createVocabularyHandler,
  updateVocabularyHandler,
  updateVocabularyRoute,
  getVocabulariesRoute,
  getVocabulariesHandler,
  getSuggestionsRoute,
  getSuggestionsHandler,
  deleteVocabularyRoute,
  deleteVocabularyHandler,
} from "./vocabulary"

export default function createApp() {
  const app = new OpenAPIHono()
  app.use(logger())
  app.use(cors({ origin: "*" }))
  app.notFound(notFoundHandler)
  app.onError(errorHandler)
  return app
}

export type RouteConfig = {
  model: LanguageModelV1
  vocabularyService: VocabularyService
}

export function applyRoutes(
  app: OpenAPIHono,
  { model, vocabularyService }: RouteConfig
) {
  return app
    .openapi(pingRoute, pingHandler)
    .openapi(createVocabularyRoute, createVocabularyHandler(vocabularyService))
    .openapi(getVocabularyRoute, getVocabularyHandler(vocabularyService))
    .openapi(getVocabulariesRoute, getVocabulariesHandler(vocabularyService))
    .openapi(updateVocabularyRoute, updateVocabularyHandler(vocabularyService))
    .openapi(getSuggestionsRoute, getSuggestionsHandler(vocabularyService))
    .openapi(deleteVocabularyRoute, deleteVocabularyHandler(vocabularyService))
}

export type AppRoutes = typeof applyRoutes
