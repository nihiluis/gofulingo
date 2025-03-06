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
import {
  createSingleVocabularyTranslationRoute,
  createSingleVocabularyTranslationHandler,
  createMultiVocabularyTranslationsRoute,
  createMultiVocabularyTranslationHandler,
  getVocabularyTranslationRoute,
  getVocabularyTranslationHandler,
  getVocabularyTranslationsHandler,
  getVocabularyTranslationsRoute,
} from "./vocabulary/translation"
import type { TranslatorService } from "@/lib/translator"
import type { TranslationDBService } from "@/lib/translationDb"
import type { VocabularyTranslationService } from "@/lib/vocabularyTranslation"

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
  translatorService: TranslatorService
  translationDbService: TranslationDBService
  vocabularyTranslationService: VocabularyTranslationService
}

export function applyRoutes(
  app: OpenAPIHono,
  {
    model,
    vocabularyService,
    translatorService,
    translationDbService,
    vocabularyTranslationService,
  }: RouteConfig
) {
  return app
    .openapi(pingRoute, pingHandler)
    .openapi(
      createVocabularyRoute,
      createVocabularyHandler({
        vocabularyService,
        translatorService,
        translationDbService,
      })
    )
    // must sit above getVocabularyRoute
    .openapi(
      getVocabularyTranslationRoute,
      getVocabularyTranslationHandler({
        vocabularyTranslationService,
      })
    )
    .openapi(
      getVocabularyTranslationsRoute,
      getVocabularyTranslationsHandler({
        vocabularyTranslationService,
      })
    )
    .openapi(getVocabularyRoute, getVocabularyHandler(vocabularyService))
    .openapi(getVocabulariesRoute, getVocabulariesHandler(vocabularyService))
    .openapi(updateVocabularyRoute, updateVocabularyHandler(vocabularyService))
    .openapi(getSuggestionsRoute, getSuggestionsHandler(vocabularyService))
    .openapi(deleteVocabularyRoute, deleteVocabularyHandler(vocabularyService))
    .openapi(
      createSingleVocabularyTranslationRoute,
      createSingleVocabularyTranslationHandler({
        vocabularyService,
        translatorService,
        translationDbService,
      })
    )
    .openapi(
      createMultiVocabularyTranslationsRoute,
      createMultiVocabularyTranslationHandler({
        vocabularyService,
        translatorService,
        translationDbService,
      })
    )
}

export type AppRoutes = typeof applyRoutes
