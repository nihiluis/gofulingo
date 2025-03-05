import { BASE_PATH } from "@/constants"
import type { AppRouteHandler } from "@/lib/types"
import { createRoute, z } from "@hono/zod-openapi"
import { VocabularyService } from "../../../lib/vocabulary"
import type { TranslatorService } from "@/lib/translator"
import type { TranslationDBService } from "@/lib/translationDb"
import { LanguageCodeSchema } from "../schema"
import { logger } from "@/lib/pino"

export const createMultiVocabularyTranslationsRoute = createRoute({
  method: "post",
  path: `${BASE_PATH}/vocabulary/translation`,
  request: {
    query: z.object({
      languageCode: z
        .string()
        .transform(code => LanguageCodeSchema.parse(code)),
    }),
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: z.object({
            updatedIds: z.array(z.number()),
            failedIds: z.array(z.number()),
          }),
        },
      },
      description:
        "Create translations for all vocabularies that have no translationId",
    },
  },
})

export type CreateMultiVocabularyTranslationRoute =
  typeof createMultiVocabularyTranslationsRoute

interface Props {
  vocabularyService: VocabularyService
  translatorService: TranslatorService
  translationDbService: TranslationDBService
}

export const createMultiVocabularyTranslationHandler =
  ({
    vocabularyService,
    translatorService,
    translationDbService,
  }: Props): AppRouteHandler<CreateMultiVocabularyTranslationRoute> =>
  async c => {
    const { languageCode } = c.req.valid("query")

    const vocabularies = await vocabularyService.getVocabularies(languageCode)

    const noTranslationVocabularies = vocabularies.filter(v => !v.translationId)

    logger.info(
      {
        vocabularies: vocabularies.length,
        noTranslationVocabularies: noTranslationVocabularies.length,
      },
      "vocabularies"
    )

    if (noTranslationVocabularies.length === 0) {
      return c.json({ failedIds: [], updatedIds: [] }, 200)
    }

    const translationTexts = await translatorService.translateMultiVocab(
      noTranslationVocabularies.map(v => v.title),
      languageCode
    )

    const translationDbs = await translationDbService.createTranslations(
      translationTexts.map(t => ({
        languageCode,
        translations: t.possibleTranslations,
        word: t.word,
      }))
    )

    const updatedIds: number[] = []
    const failedIds: number[] = []

    for (const vocab of noTranslationVocabularies) {
      const matchingTranslation = translationDbs.find(
        t => t.word === vocab.title
      )

      if (!matchingTranslation) {
        failedIds.push(vocab.id)
        continue
      }

      updatedIds.push(vocab.id)

      await vocabularyService.updateVocabulary(vocab.id, {
        translationId: matchingTranslation.id,
      })
    }

    return c.json(
      {
        updatedIds,
        failedIds,
      },
      200
    )
  }
